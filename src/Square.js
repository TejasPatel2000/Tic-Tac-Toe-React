import React from 'react';
import './Square.css';

export function Square(props){
    return <div class="box" onClick={() => {props.fillSquare(props.index)}}> {props.board[props.index]} </div>
        
}
