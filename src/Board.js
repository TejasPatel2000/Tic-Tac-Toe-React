import React from 'react';
import './Board.css';
import { useState, useEffect } from 'react';
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io(); // Connects to socket connection

export function Board() {
    const [board, setBoard] = useState([]);
    const [isX, setXNext ] = useState(true); 
    
    function fillSquare(index){
      setBoard(prevBoard => { 
          let newBoard=[...prevBoard];
          var player=isX ? "X" : "O";
          newBoard[index]=player;
          return newBoard;
      });
      socket.emit('square', { index: index });
      // var player = isX ? "X" : "O";
      // return setBoard(prevBoard => [...prevBoard], board[index]=player );
 }
    
    
     useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
        socket.on('square', (data) => {
          console.log('click event received!');
          console.log(data);
        
          // If the server sends a message (on behalf of another client), then we
          // add it to the list of messages to render it on the UI.
          
          setBoard(prevBoard => { 
            let newBoard=[...prevBoard];
            newBoard[data.index]=isX ? "X" : "O";
            console.log("SErver", newBoard);
            // setXNext(!isX);
            return newBoard;
          });
            
            
          //var player = isX ? "X" : "O";
          //return setBoard(prevBoard => [...prevBoard], board[data.index]=player);
          
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
      </div>

    
}