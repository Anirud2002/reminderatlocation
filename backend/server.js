const express = require('express');
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const port = process.env.PORT || 3000

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}))
app.use(express.json())
require('dotenv').config()
app.use(express.urlencoded({extended: true}))


// connection to mongoDB Atlas
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('db connected'))
.catch((err) => console.log(err))

// sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.ATLAS_URI
    })
}));
app.use(passport.authenticate('session'));

// API routes
app.use('/reminder', require('./routes/newReminder'))
app.use('/auth', require('./routes/auth'))

app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})