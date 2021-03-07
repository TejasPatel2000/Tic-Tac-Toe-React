import React from 'react';
import { useState, useEffect } from 'react'; 
import io from 'socket.io-client';


const socket = io(); // Connects to socket connection


export function Leaderboard(props){
        const [users, changeUsers]  = useState({})

        var user_current=props.name;
        var all_players = Object.keys(users).map(function(key) {
            return [key, users[key]];
        });

all_players.sort(function(first, second) {
  return second[1] - first[1];
});

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
            var copy = {...data};
            changeUsers(copy);
        });
        
         socket.on('updateScore', (data) => {
            console.log(data);
            var copy = {...data};
            console.log("Leaderboard update event received");
            changeUsers(copy);
        });
        
        
        socket.on('db', (data) => {
            console.log("Leaderboard event received");
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
        
           {all_players.map(player => {
            if(user_current==player[0]) {
                return <tr><td><b><i>{player[0]}</i></b></td><td>{player[1]}</td></tr>;
            }
            return <tr><td>{player[0]}</td><td>{player[1]}</td></tr>;
           }
            )
            }
            
        </tbody>
    </table>
    </div>
    )
}