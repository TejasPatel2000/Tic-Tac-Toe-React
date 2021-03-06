import React from 'react';
import { useState, useEffect } from 'react'; 
import io from 'socket.io-client';


const socket = io(); // Connects to socket connection


export function Leaderboard(){
    
    const [users, changeUsers]  = useState({})
    
    var a = {
        a: 1,
        b: 2,
        c: 3
    };

// Iterate over the property names:
// for (let user of Object.keys(a)) {
//     var score = a[score];
// }

// for (const [username, score] of Object.entries(a))
//     console.log(username, score);



    useEffect(() => {
        // Listening for a chat event emitted by the server. If received, we
        // run the code in the function that is passed in as the second arg
        socket.on('db', (data) => {
            console.log("Leaderboard event received");
            var response = {...data.user};
            console.log("RESPONSE", response);
            changeUsers(data);
            console.log("USERS", users);
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
           {Object.keys(users).map(function(key) {
            return <tr><td>{key}</td><td>{users[key]}</td></tr>;
            })}
            
        </tbody>
    </table>
    </div>
    )
}