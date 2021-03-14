import React, { useState, useEffect } from 'react';
import './Board.css';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import Square from './Square';

const socket = io(); // Connects to socket connection

// export function Board(props) {
function Board(props) {
  const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null]);
  const [isX, setXNext] = useState(true);
  const [isTurn, setTurn] = useState(isX);
  /* const [users, changeUsers] = useState({
    playerX: '',
    playerO: '',
    spectators: [],
  }); */

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
    for (let i = 0; i < lines.length; i += 1) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // if(squares[a] == "X"){
        //  socket.emit("updateScore", {winner:props.dict['playerX'], loser:props.dict['playerO']});
        // }else{
        //  socket.emit("updateScore", {winner:props.dict['playerO'], loser:props.dict['playerX']});
        // }
        return props.dict[`player${squares[a]}`];
      } if (!squares.includes(null)) {
        return 'DRAW';
      }
    }
    return null;
  }
  const winner = calculateWinner(board);

  function fillSquare(index) {
    const player = props.name;
    const newBoard = [...board];
    if (winner || newBoard[index] || !isTurn) return;
    if (player === props.dict[`player${isX ? 'X' : 'O'}`]) {
      setTurn((prevTurn) => !prevTurn);
      newBoard[index] = isX ? 'X' : 'O';
      setBoard(newBoard);
      socket.emit('square', { board: newBoard, isX });
      setXNext(!isX);
    }
  }

  function restart() {
    const newBoard = [null, null, null, null, null, null, null, null, null];
    setBoard(newBoard);
    setTurn(true);
    setXNext(true);
    socket.emit('square', { board: newBoard });
  }

  useEffect(() => {
    if (winner === props.dict.playerX && props.dict.playerX === props.name) {
      socket.emit('updateScore', { winner: props.dict.playerX, loser: props.dict.playerO });
    } else if (winner === props.dict.playerO && props.dict.playerO === props.name) {
      socket.emit('updateScore', { winner: props.dict.playerO, loser: props.dict.playerX });
    }
  }, [winner]);

  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second ar

    socket.on('square', (data) => {
      setBoard(data.board);
      setTurn(true);
      setXNext(!data.isX);
    });

    // socket.on('login', (data) => {
    //   console.log('Login event received!', data);
    //   // const response = { ...data.user };
    //   // changeUsers(response);
    // });
  }, []);

  return (
    <div className="board">
      <Square fillSquare={fillSquare} board={board} index={0} />
      <Square fillSquare={fillSquare} board={board} index={1} />
      <Square fillSquare={fillSquare} board={board} index={2} />
      <Square fillSquare={fillSquare} board={board} index={3} />
      <Square fillSquare={fillSquare} board={board} index={4} />
      <Square fillSquare={fillSquare} board={board} index={5} />
      <Square fillSquare={fillSquare} board={board} index={6} />
      <Square fillSquare={fillSquare} board={board} index={7} />
      <Square fillSquare={fillSquare} board={board} index={8} />

      {winner
        ? (
          <div>
            <h3>
              {' '}
              {winner === 'DRAW' ? 'It is a draw' : `Winner: ${winner}`}
              {' '}
            </h3>
            <button type="button" onClick={restart}>Restart</button>
          </div>
        )
        : (
          <div>
            <h3>
              {' '}
              Next Player:
              {(isX ? 'X' : 'O')}
            </h3>
          </div>
        )}
      <br />
    </div>
  );
}
Board.propTypes = {
  dict: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
// Board.propTypes = {
//   params: React.PropTypes.object,
// };
export default Board;
