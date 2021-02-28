import React from 'react';
import './Board.css';
import { useState, useEffect } from 'react';
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Board(props) {
    const [board, setBoard] = useState([null,null,null,null,null,null,null,null,null]);
    const [isX, setXNext] = useState(true);
    const [turnEnd, setEnd] = useState(isX);
    const [users, changeUsers]  = useState({ 
      playerX: "",
      playerO: "",
      spectators: [],
    });
    const winner = calculateWinner(board);

    
    function fillSquare(index){
        const player = props.name;
        console.log(turnEnd);
        if(!users['spectators'].includes(player)){
          let newBoard = [...board];
          if (winner || newBoard[index])  return;
          //setEnd(prevTurn => !prevTurn);
          if(users['playerX']==player && isX){
           newBoard[index] = "X";
           setBoard(newBoard);
          }else if(users['playerO']==player && !isX){
            newBoard[index] = "O";
            setBoard(newBoard);
          }
          socket.emit('square', { board: newBoard, isX:isX });
          setXNext(!isX);
        }else return;
      
 }
 
    function calculateWinner(squares) {
      const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          if (squares[a] == "X"){
            return users["playerX"];
          }else{
            return users["playerO"];
          }
        } else if(!squares.includes(null)){
          return "DRAW";
        }
      }
    return null;
  }
  
  function restart() {
    setBoard([null,null,null,null,null,null,null,null,null]);
  }
    
    
     useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
        socket.on('square', (data) => {
          console.log('click event received!');
          console.log(data);
  
          // If the server sends a message (on behalf of another client), then we
          // add it to the list of messages to render it on the UI.
          
          setBoard(data.board);
          setEnd(prevTurn => !prevTurn);
          setXNext(!data.isX);
          
          
        });
        
        
        socket.on('login', (data) => {
          console.log('login event received on board.js!');
          console.log(data);
          var response = {...data.user};
          changeUsers(response);
        });
        
    }, []);
    

    return <div class="board">
        <Square fillSquare={fillSquare} board={board} index={0} />
        <Square fillSquare={fillSquare} board={board} index={1} />
        <Square fillSquare={fillSquare} board={board} index={2} />
        <Square fillSquare={fillSquare} board={board} index={3} />
        <Square fillSquare={fillSquare} board={board} index={4} />
        <Square fillSquare={fillSquare} board={board} index={5} />
        <Square fillSquare={fillSquare} board={board} index={6} />
        <Square fillSquare={fillSquare} board={board} index={7} />
        <Square fillSquare={fillSquare} board={board} index={8} />
        <p>
          {winner 
          ? <div>
            {winner=="DRAW" ? "It is a draw" : "Winner: " + winner}
            <button onClick={restart} >Restart</button>
          </div>
          : <div>
            Next Player: {(isX ? "X" : "O")}
          </div>
          }
        </p>
      </div>


    
}