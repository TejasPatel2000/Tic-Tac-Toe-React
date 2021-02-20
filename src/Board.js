import React from 'react';
import './Board.css';
import { useState } from 'react';
import { Square } from './Square.js';

export function Board() {
    const [board, setBoard] = useState([]);
    const [isX, setXNext ] = useState(true); // state2 variable is a number

    function fillSquare(index){
      const newBoard = [...board];
      newBoard[index] = isX ? "X" : "O";
      setXNext(!isX);
      setBoard(newBoard);
     // setBoard(prevBoard =>[index, "X"]);
    }
    
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
