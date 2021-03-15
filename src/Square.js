import React from 'react';
import './Square.css';
import PropTypes from 'prop-types';

function Square(props) {
  const { board, index } = props;
  return (
    <div
      role="button"
      tabIndex={0}
      className="box"
      onClick={() => {
        props.fillSquare(props.index);
      }}
      onKeyDown={() => {}}
    >
      {' '}
      {board[index]}
      {' '}
    </div>
  );
}
Square.propTypes = {
  board: PropTypes.string.isRequired,
  index: PropTypes.string.isRequired,
  fillSquare: PropTypes.string.isRequired,
};

export default Square;
