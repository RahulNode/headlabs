# HeadLabs challenge 


## Before Setup

1. Create a free account on [mLab](https://mlab.com)
2. Login to your account
3. Create a free sandbox database
4. Create a user for this database
5. Copy the connection url found on the database's home page
6. Create a `.env` file in this app's root directory
7. In this file, format it like below
```
MONGODB_URL="mongodb://<dbuser>:<dbpassword>....." <-- your copied connection url
SECRET="add in the secret you'd like for the app to use"
```
and then continue with setup

## Setup (With Yarn)

1. Install the current LTS version of Nodejs and Yarn
2. Open a terminal and CD to the app's root directory
3. run `yarn install`
4. CD to client directory
5. run `yarn install`
6. run `yarn build`
7. CD back to the app's root directory
8. run `yarn start`
9. Open a browser window and point it to `http://localhost:5000`

## Setup (Without Yarn)

1. Install the current LTS version of Nodejs
2. Open a terminal and CD to the app's root directory
3. run `npm install`
4. CD to client directory
5. run `npm install`
6. run `npm run build`
7. CD back to the app's root directory
8. run `npm start`
9. Open a browser window and point it to `http://localhost:5000`

### *NOTE: If you want to run multiple instance, you MUST log in to two separate browsers. Logging in, in a separate tab will invalidate the previous session.