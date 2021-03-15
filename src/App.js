import './App.css';
import React, { useState, useRef, useEffect } from 'react';

import io from 'socket.io-client';
import Board from './Board';

import Leaderboard from './LeaderBoard';

const socket = io();

function App() {
  const [user, changeUsers] = useState({
    playerX: '',
    playerO: '',
    spectators: [],
  });

  const [username, setUsername] = useState('');

  const [loggedIn, setStatus] = useState(false);
  const inputRef = useRef(null);

  const [showLeader, changeLeader] = useState(false);

  function login() {
    if (inputRef != null) {
      setUsername(inputRef.current.value);
      if (inputRef.current.value.length > 0) {
        setUsername(inputRef.current.value);
        const newUser = { ...user };
        if (newUser.playerX === '') {
          newUser.playerX = inputRef.current.value;
          setStatus(true);
        } else if (newUser.playerO === '') {
          newUser.playerO = inputRef.current.value;
          setStatus(true);
        } else {
          newUser.spectators.push(inputRef.current.value);
          setStatus(true);
        }
        changeUsers(newUser);
        socket.emit('login', { user: newUser });
        socket.emit('db', inputRef.current.value);
      }
    }
  }

  function showLeaderBoard() {
    changeLeader(!showLeader);
    socket.emit('showLeaderBoard');
  }

  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('login', (data) => {
      changeUsers(data.user);
    });
  }, []);

  //  if (inputRef != null) {
  return (
    <div>
      <h1> Tic Tac Toe! </h1>
      <button type="button" onClick={showLeaderBoard}>
        {' '}
        Show Leaderboard
        {' '}
      </button>
      {showLeader && <Leaderboard name={username} />}
      <h3>
        Player X:
        {user.playerX}
      </h3>
      <h3>
        Player O:
        {user.playerO}
      </h3>
      <h3>
        Spectators:
        <ul>
          {user.spectators.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </h3>
      {loggedIn ? (
        <div data-testid="tic-tac-toe-board">
          <h2>
            {' '}
            Your username is:
            {username}
          </h2>
          <Board name={username} dict={user} />
        </div>
      ) : (
        <div className="group">
          <br />
          <input ref={inputRef} type="text" placeholder="Username" />
          <div className="bar" />
          <button type="button" onClick={login}>
            Login
            {' '}
          </button>
        </div>
      )}
    </div>
  );
  // }
}
export default App;
