import logo from './logo.svg';
import './App.css';
import { ListItem } from './ListItem.js';
import { useState, useRef } from 'react';

import { Board } from './Board.js';

function App() {
  const [myList, changeList]  = useState([]);
  const inputRef = useRef(null);

  
  function onClickButton() {
    const userText = inputRef.current.value;
    changeList(prevList => [...myList, userText]);
  }
  
  const [board, setBoard] = useState([]);
  

  return (
    <div>
    <h1> Tic Tac Toe </h1>
    
    <Board />
    
    </div>
  );
    // <input ref = {inputRef} type = "text" />
    // <button onClick={onClickButton} >Add to list!</button>
    // <ul>
    //   {myList.map(item => <ListItem name={item} />)}
    // </ul>
}

export default App;
