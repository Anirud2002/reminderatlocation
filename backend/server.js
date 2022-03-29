const express = require('express');
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//connection to mongoDB Atlas
const uri = process.env.ATLAS_URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('db connected'))
.catch((err) => console.log(err))

app.use('/reminder', require('./routes/newReminder'))

app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})