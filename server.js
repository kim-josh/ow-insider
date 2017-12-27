const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {DATABASE_URL, TEST_DATABASE_URL, PORT} = require('./config');
const ejs = require('ejs');
const flash = require('connect-flash-plus');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('./auth/strategies');
const path = require('path');
const session = require('express-session');
// Routers and authentication strategies
const localStrategy = require('./auth/strategies');
const {userRouter, authRouter, guideRouter, heroRouter, mapRouter} = require('./routes');

// provides access to static files in public and resources 
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resources')));
app.use(bodyParser.json());
app.use(cookieParser());
// required for passport - session secret
app.use(session({ 
  secret: 'joshiscool',
  name: 'ow_cookie',
  cookie: {secure: false, maxAge: (4 * 60 * 60 * 1000)},
  resave: true,
  saveUninitialized: true
})); 

// Logging purposes
app.use(morgan('dev'));
// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(flash()); // use connect-flash for flash messages stored in session 
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions 
app.use('/auth', authRouter);
app.use('/users', userRouter);
// app.use('/guides', guideRouter);
app.use('/heroes', heroRouter);
app.use('/maps', mapRouter);


app.get('/logout', (req, res) => {
  req.logOut();
  return res.status(200).json({redirect: '/', message: 'Log out successful'});
});

app.get('/404', (req, res) => {
  res.status(404).json({
    message: 'Uh oh! We had trouble processing what you were trying to do :('
  });
});

app.get('/profile', (req, res) => {
  res.sendFile(path.resolve('public/profile/index.html'));
});

app.get('/profile/change-password', (req, res) => {
  res.sendFile(path.resolve('public/profile/change-password.html'));
});

app.get('/session', authorize, (req,res) => {
  res.status(200).json({user: req.user.userRepr()});
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/index.html'));
});

app.get('/hero', (req, res) => {
  res.sendFile(path.resolve('public/heroes/heroes.html'));
});

app.get('/map', (req, res) => {
  res.sendFile(path.resolve('public/maps/maps.html'));
});

app.get('/guides', (req, res) => {
  res.json({
    message: 'This feature will be implemented in the future. Once all the landing pages for ' +
      'each hero are created, users will be able to upload/view guides for their heroes of choice.'
  })
})
// Makes Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, {useMongoClient: true}, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`App is running on port ${port}`);
        console.log(databaseUrl + " " + PORT);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if(err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

// Ensures that only the authorized 
function authorize(req, res, next) {
  if (req.user !== undefined) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
}

module.exports = {app, runServer, closeServer};