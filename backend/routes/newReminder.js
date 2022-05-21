const express = require('express')
const router =  express.Router()

const NewReminder = require('../models/NewReminder')

router.get('/getreminders', async (req, res) => {
    await NewReminder.find({})
    .then((result) => {
        res.json({"result": result})
    })
})

router.post('/add', (req, res) => {
    const {location} = req.body

    NewReminder.findOne({"location.locationName": location.locationName}, (err, data) => {
        if (err){
            console.log(err)
            res.send({success: false, message: "sorry brother"})
        }
        else if(data){
            data.location.reminders.push(location.reminders[0])
            data.save()
            res.send({success: true})
        }
        else{
            const newReminder = new NewReminder({
                location
            })
            newReminder.save()
            res.send({success: true})
        }
    }) 
})

router.put("/edit/:reminderId/:id", (req, res) => {
    const {reminderId, id} = req.params
    const {location} = req.body
    NewReminder.findById(reminderId, (err, data) => {
        if (err){
            console.log(err)
            return
        }
        else if (data) {
            if (data.location.locationName !== location.locationName){
                if(data.location.reminders.length === 1){
                    data.delete()
                }
                else{
                    data.location.reminders = data.location.reminders.filter(rem => rem.rem_id !== id)
                    data.save()
                }
                NewReminder.findOne({"location.locationName": location.locationName}, (err, doc) => {
                    if(err){
                        console.log(err)
                        return
                    }
                    else if (doc){
                        data.location.reminders.push(location.reminders[0])
                        data.save()
                        res.send({success: true})
                    }else{
                        const newReminder = new NewReminder({
                            location
                        })
                        newReminder.save()
                        res.send({success: true})
                    }
                })
            }else{
                data.location.reminders = data.location.reminders.filter(dat => dat.rem_id !== id)
                data.location.reminders.push(location.reminders[0])
                data.save()
                res.send({success: true})
            }
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