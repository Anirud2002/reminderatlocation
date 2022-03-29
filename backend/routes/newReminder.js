const express = require('express')
const router =  express.Router()

const NewReminder = require('../models/NewReminder')

router.get('/getreminders', (req, res) => {
    NewReminder.find({})
    .then((result) => {
        res.send(result)
    })
})

router.post('/add', (req, res) => {
    const {location} = req.body
    console.log(location.locationName)
    NewReminder.findOne({"location.locationName": location.locationName}, (err, data) => {
        if (err){
            console.log(err)
        }
        else if(data){
            data.location.reminders.push(location.reminders[0])
            data.save()
        }
        if(data === null){
            const newReminder = new NewReminder({
                location
            })
            newReminder.save()
            // res.send('Hurray save bhayo')
        }
    }) 
})

module.exports = router