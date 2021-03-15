import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import './LeaderBoard.css';

const socket = io(); // Connects to socket connection

function Leaderboard(props) {
  const [users, changeUsers] = useState({});
  const { name } = props;
  const userCurrent = name;
  const allPlayers = Object.keys(users).map((key) => [key, users[key]]);

  allPlayers.sort((first, second) => second[1] - first[1]);

  // Iterate over the property names:
  // for (let user of Object.keys(a)) {
  //     var score = a[score];
  // }

  // for (const [username, score] of Object.entries(a))
  //     console.log(username, score);

  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('showLeaderBoard', (data) => {
      const copy = { ...data };
      changeUsers(copy);
    });

    socket.on('updateScore', (data) => {
      const copy = { ...data };
      changeUsers(copy);
    });

    socket.on('db', (data) => {
      changeUsers(data);
    });
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>UserName</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {allPlayers.map((player) => {
            if (userCurrent === player[0]) {
              return (
                <tr>
                  <td id="special_user">
                    <b>
                      <i>{player[0]}</i>
                    </b>
                  </td>
                  <td id="special_user">
                    <b>
                      <i>{player[1]}</i>
                    </b>
                  </td>
                </tr>
              );
            }
            return (
              <tr>
                <td>{player[0]}</td>
                <td>{player[1]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
Leaderboard.propTypes = {
  name: PropTypes.string.isRequired,
};
export default Leaderboard;
