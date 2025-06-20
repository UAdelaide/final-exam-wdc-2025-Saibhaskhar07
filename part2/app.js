const express = require('express');
const path = require('path');
require('dotenv').config();
// cookies
const session = require('express-session')
const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Cookies for session management
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized : false,
    cookie:{secure:false}
}))

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api', require('./routes/userRoutes'));


app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);


// Export the app instead of listening here
module.exports = app;