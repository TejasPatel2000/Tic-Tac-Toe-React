#Heroku Link:
## react-toe.herokuapp.com
# Flask and create-react-app (Milestone 1 info below)

## Requirements
1. `npm install`
2. `pip install -r requirements.txt`

## Setup
1. Run `echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local` in the project directory

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

## Deploy to Heroku
*Don't do the Heroku step for assignments, you only need to deploy for Project 2*
1. Create a Heroku app: `heroku cre  ate --buildpack heroku/python`
2. Add nodejs buildpack: `heroku buildpacks:add --index 1 heroku/nodejs`
3. Push to Heroku: `git push heroku main`


# Project 2 Milestone 1
## How to clone Repo/Run application
1. Run `git clone https://github.com/NJIT-CS490-SP21/project2-trp35.git`
2. Run steps above(Flask and create-react app) up until "Deploy to Heroku."
3. To be able to play with someone else on the same device, you will have to open the same browser twice BEFORE anyone logs in. Once all desired users are there, you can login one by one, and once two players are in you will be able to begin playing.
4. To run the app through heroku, simply go to the following link: react-toe.herokuapp.com. Once all desired users have opened the link to play, you will be able to play with people on different devices. (You will not be able to play with someone, if you login before they have opened their browser)

## Known Problems:
1. One known problem with the app is that when 2 users have the same username, it messes up with who can click on the board, or who is assigned to X and O. This is because in my React Application, to keep track of playerX/O and spectators, I use a dictionary where the value is their username and I use that to determine whether they can play or not and what letter they are. To resolve this issue, I could create functionality where I check to see if that username is taken when they try to login. This would give everyone a unique name and prevent the current issue.
2. One known problem with the app is that all users must open the browser before anyone logs in, otherwise the socket would have already emitted, and any new users will not have the previous information. To resolve this issue, on the server side, we would need to potentially use something called a Thread(or gunicorn or wsgi) on the server side of the application, where you would be able to consistently process data and asynchrously update the website. I am still not sure about the exact approach behind this, as I have not done enough research, however this would be my starting point.
 
## Technical Issues:
1. A technical issue I had while trying to deploy to Heroku was that I was able to successfully deploy, however when I tried to open the application it would give a URL not found error. To resolve this issue, I opened up the heroku logs and found that I was getting an error with one of the npm packages not being installed. After more research, I found that I needed to install a socketio-client package with https://socket.io/docs/v2/client-installation/. This then updated the packages.json file and once that was pushed to herokue the application was able to run.
2. Another technical issue I ran into was regarding assigning one person to playerX, one to playerO, and making sure spectators couldn't play as well as making sure only the person whose turn it was, is able to play. To overcome this issue, I realized that the use of a dictionary would be necessary. I got this tip from one of my classmates, who was able to get this functionality to work using dictionaries. I at that point was only using one array to keep track of all users. So I had to restructure a lot of my code of how players were asssigned. I looked up resources regarding how to use a UseState with dictionaries, and having to pass the dictionary between components so that the users would update appropriately on login. I also had to use props so that on each browser the username would stay the same and not change as new users are added, and I used this to check if the current username was either PlayerX or PlayerO and if they were they would be able to click on a square. I also had to use a new use state to see if it was the current players turn or not.
