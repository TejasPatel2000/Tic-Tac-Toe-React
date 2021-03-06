import os
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv()) # This is to load your env variables from .env


app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# IMPORTANT: This must be AFTER creating db variable to prevent
# circular import issues
import models

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    print('User disconnected!')

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided

@socketio.on('chat')
def on_chat(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('chat',  data, broadcast=True, include_self=False)
    
@socketio.on('square')
def on_square(data): # data is whatever arg you pass in your emit call on client
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('square',  data, broadcast=True, include_self=False)
    
@socketio.on('login')
def on_login(data):
    print(str(data))
    socketio.emit("login", data, broadcast=True, include_self=False)
    
    
@socketio.on('db')
def on_db(data):
    exists = models.Person.query.filter_by(username=data).first()
    if exists == None:
        user = models.Person(username=data, score=100)
        db.session.add(user)
        db.session.commit()
        all_people = models.Person.query.all()
        users = {}
        
        for person in all_people:
            users[person.username] = person.score
        
        socketio.emit('db', users, broadcast=True, include_self=False)
        
        #db.session.query(Person)
            

    # socketio.emit('db', data, broadcast=True, include_self=False)
    
# @socketio.on('updateScore')
# def on_updateScore(data):
#     winner = db.session.query(models.People)

# Note that we don't call app.run anymore. We call socketio.run with app arg
if __name__ == "__main__":
    db.create_all()
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
        debug=True
    )