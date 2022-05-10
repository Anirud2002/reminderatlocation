const express = require('express');
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const port = process.env.PORT || 3000

app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
}))
app.use(express.json())
require('dotenv').config()
app.use(express.urlencoded({extended: true}))


//connection to mongoDB Atlas
mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('db connected'))
.catch((err) => console.log(err))

app.use('/reminder', require('./routes/newReminder'))

app.get('/', (req, res)=> {
    res.json({"msg": " Yo boi welcome"})
})

app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})