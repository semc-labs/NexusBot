# NexusBot
Work in Progress 

A simple discord bot which will track channel messages and integrate with WordPress, and also manages adding people to Nexus Aurora newsletter.

Future ideas include an admin center for viewing statistics and taking actions without posting on discord.

## Install
```sh
npm install
```

## Config
Add all relevent config variables to the .env file. See .env-example for required values

## Start Bot

```sh
npm start
```

## Production Start (Optional)
Requires npm [pm2](https://www.npmjs.com/package/pm2)

Install
```sh
npm install pm2 -g
```

Start
```sh
npm run prod
```

### Development Hosting with localhost.run
[localhost.run](http://localhost.run/docs/)

Setup local tunnel to localhost
```sh
ssh -R 80:localhost:8081 localhost.run
```


### Development Hosting with ngrok

Follow this [ngrok setup guide](https://dashboard.ngrok.com/get-started/setup)

If you are on windows you can use 'ngrok.exe' instead of adding it to your path

point ngrok to our local port using
```sh
ngrok http 8081
```
Then set the https url ngrok generates in the NexusBot_Plugin settings

### External Requirements
* [JWT Authentication for WP REST API](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
* [Discord Bot](https://discord.com/developers/applications)


### Using
* [NodeJS](https://nodejs.org/en/) 
* [ExpressJS](https://expressjs.com/)
* [Axios](https://axios-http.com/)
* [Moment](https://momentjs.com/docs/)
* [DiscordJS](https://discord.js.org/)
* [Sequelize](https://sequelize.org/)
* [SQLite](https://www.sqlite.org/index.html)
* [Dokku (Hosting)](https://dokku.com)
