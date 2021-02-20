import React from 'react';
import './Square.css';
import { useState } from 'react';

export function Square(props){
    return <div class="box" onClick={() => {props.fillSquare(props.index)}}>{props.board[props.index]} </div>
        
}
