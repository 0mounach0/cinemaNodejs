// Expressx
const express = require('express');
const app = express();

// Morgan (show logs)
const morgan = require('morgan');

// Body-parser
const bodyParser = require('body-parser');

// Mongoose
const mongoose = require('mongoose');

var session = require('express-session');

//---------
const userRoutes = require('./api/routes/userRoutes');
const cityRoutes = require('./api/routes/cityRoutes');
const cinemaRoutes = require('./api/routes/cinemaRoutes');
const movieRoutes = require('./api/routes/movieRoutes');
const qrcodeRoutes = require('./api/routes/qrcodeRoutes');

// MongoDB atlas connection


/*  mongoose.connect(
     'mongodb://mounach:' +
     process.env.MONGO_ATLAS_PASSWORD + 
     '@nostroflix-shard-00-00-butgu.mongodb.net:27017,nostroflix-shard-00-01-butgu.mongodb.net:27017,nostroflix-shard-00-02-butgu.mongodb.net:27017/test?ssl=true&replicaSet=nostroflix-shard-0&authSource=admin&retryWrites=true',
     {
        useNewUrlParser: true,
        useFindAndModify: false
     }); */


mongoose.connect(
    'mongodb://localhost:27017/cinema',
        {
            useNewUrlParser: true,
            useFindAndModify: false
        });

//------------------ Middlewares ----------------

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// Handling CORS
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// express-session 
app.use(session({
    key: 'user',
    secret: process.env.SESSION_KEY,
    name:'uniqueSessionID',
    cookie: {
        expires: 600000
    },
    resave: false,
    saveUninitialized: false,
}));

// routes
app.use('/api/users', userRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/cinemas', cinemaRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/qrcode', qrcodeRoutes);



// Handling errors

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//------

module.exports = app;
