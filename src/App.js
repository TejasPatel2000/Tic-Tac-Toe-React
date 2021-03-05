import logo from './logo.svg';
import './App.css';
import { useState, useRef, useEffect } from 'react';

import { Board } from './Board.js';
import io from 'socket.io-client';
import { Board } from './Board.js';


const socket = io();

function App() {
  const [user, changeUsers]  = useState({ 
      playerX: "",
      playerO: "",
      spectators: [],
    });
  
  const [username, setUsername] = useState("");
    
  const [loggedIn, setStatus] = useState(false);
  const inputRef = useRef(null);
  
  function login() { 
    if(inputRef != null){
      setStatus(true);
      const username = inputRef.current.value;
      setUsername(username);
      const newUser = {...user};
      if(newUser["playerX"] == ""){
        newUser['playerX'] = username;
      }else if(newUser['playerO'] == ""){
        newUser['playerO'] = username;
      }else{
        newUser['spectators'].push(username);
      }
      changeUsers(newUser);
      socket.emit('login', {user:newUser});
    }
  }
  
   useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
        socket.on('login', (data) => {
          console.log('login event received!');
          console.log(data);
          changeUsers(data.user);

        });
    }, []);
    
  if(inputRef != null){
    return <div>
        <h1> Tic Tac Toe </h1>
        <h3>Player X: {user["playerX"]}</h3>
            <h3>Player O: {user["playerO"]}</h3>
            <h3>
            Spectators:
            <ul>
            {user["spectators"].map((item) => <li>{item}</li>)} 
            </ul>
          </h3>
        {loggedIn 
        ? (<div>
            <h2> Your username is: {username} </h2>
            {user['playerO'] != "" &&
              <Board name={username} dict={user}/> 
            }
          </div>)
        : (<div class ="group"> 
          <br/>
          <input ref = {inputRef} type = "text" />
          <label for="name">UserName</label>
          <div class="bar"></div>
          
          <button onClick={login} >Login </button>
        </div>)
        }
        
      </div>
  }

  return (
    <div>
      <h1>Chat Messages</h1>
      Enter message here: <input ref={inputRef} type="text" />
      <button onClick={onClickButton}>Send</button>
      <ul>
        {messages.map((item, index) => <ListItem key={index} name={item} />)}
      </ul>
        <Board/>
    </div>
  );
}

export default App;
