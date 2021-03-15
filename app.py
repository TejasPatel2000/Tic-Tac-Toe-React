"""Backend"""
import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # This is to load your env variables from .env

APP = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models

COR = CORS(APP, resources={r"/*": {"origins": "*"}})

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """Sends files from directory."""
    return send_from_directory('./build', filename)


# When a client connects from this Socket connection, this function is run
@SOCKETIO.on('connect')
def on_connect():
    """connects user"""
    print('User connected!')


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    """prints when browser disconnects"""
    print('User disconnected!')


# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided


@SOCKETIO.on('chat')
def on_chat(data):  # data is whatever arg you pass in your emit call on client
    """Chat event used from demo."""
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('chat', data, broadcast=True, include_self=False)


@SOCKETIO.on('square')
def on_square(
        data):  # data is whatever arg you pass in your emit call on client
    """When user clicks on a square to emit to other browsers"""
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('square', data, broadcast=True, include_self=False)


@SOCKETIO.on('login')
def on_login(data):
    """emit login event"""
    print(str(data))
    SOCKETIO.emit("login", data, broadcast=True, include_self=False)


@SOCKETIO.on('db')
def on_db(data):
    """Checks if user exists in db."""
    players = {}
    check = exists(data)
    print("CHECKKKK", check)
    if check is False:
        players = add_to_db(data)
    SOCKETIO.emit('db', players, broadcast=True, include_self=False)
    #db.session.query(Person)
    
def new_user(user):
    user = models.Person(username=user, score=100)
    return user

def add_to_db(user):
    """Add user to db"""
    players = {}
    u = new_user(user)
    DB.session.add(u)
    DB.session.commit()
    all_people = models.Person.query.all()

    for person in all_people:
        players[person.username] = person.score
    
    return players

def exists(user):
    """Check to see if user exists in db"""
    ex = models.Person.query.filter_by(username=user).first()
    if ex is None or ex is False :
        return False
    else:
        return True

def win_update(score):
    """Update score by one"""
    return score + 1
    
def lose_update(score):
    """Lower score by one"""
    return score - 1

@SOCKETIO.on('updateScore')
def on_update_score(data):
    """used to update score."""
    # winner = db.session.query(models.Person).filter_by(username=data['winner']).first()
    # loser = db.session.query(models.Person).get(data['loser'])

    winner = DB.session.query(
        models.Person).filter_by(username=data['winner']).first()
    loser = DB.session.query(
        models.Person).filter_by(username=data['loser']).first()

    winner.score = win_update(winner.score)
    loser.score = lose_update(loser.score)

    DB.session.commit()

    all_people = models.Person.query.all()
    scores_users = {}
    for person in all_people:
        scores_users[person.username] = person.score

    SOCKETIO.emit('updateScore',
                  scores_users,
                  broadcast=True,
                  include_self=False)


@SOCKETIO.on("showLeaderBoard")
def on_show_leaderboard():
    """update leaderboard"""
    all_people = models.Person.query.all()
    users = {}
    for person in all_people:
        users[person.username] = person.score

    SOCKETIO.emit('showLeaderBoard', users, broadcast=True, include_self=False)


# Note that we don't call app.run anymore. We call socketio.run with app arg
if __name__ == "__main__":
    DB.create_all()
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True)
