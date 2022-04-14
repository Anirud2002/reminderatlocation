const express = require('express')
const router =  express.Router()

const NewReminder = require('../models/NewReminder')

router.get('/getreminders', async (req, res) => {
    await NewReminder.find({})
    .then((result) => {
        res.send(result)
    })
})

router.post('/add', (req, res) => {
    const {location} = req.body

    NewReminder.findOne({"location.locationName": location.locationName}, (err, data) => {
        if (err){
            console.log(err)
            res.send({success: false})
        }
        else if(data){
            data.location.reminders.push(location.reminders[0])
            data.save()
            res.send({success: true})
        }
        if(data === null){
            const newReminder = new NewReminder({
                location
            })
            newReminder.save()
            res.send({success: true})
        }
    }) 
})

router.put("/deletereminder/:reminderId/:id", (req, res) => {
    const {reminderId, id} = req.params

    NewReminder.findById(reminderId, (err, doc) => {
        if (err) console.log(err)
        else if (doc.location.reminders.length === 1) {
            doc.delete().then(() => {
                NewReminder.find({})
                .then(result => res.send(result))
            })
        } 
        else{
            doc.location.reminders = doc.location.reminders.filter(reminder => reminder.rem_id !== id)
            doc.save().then(() => {
                NewReminder.find({})
                .then(result => res.send(result))
            })
        }
    })
})

module.exports = router