const mongoose = require('mongoose');

const NewReminderSchema = mongoose.Schema({
    location: {
        locationName: {
            type: String,
            required: true
        },
        reminders: {
            type: Array,
            required: true
        },
        locationDetails: {
            lat: {type:Number, required: true},
            lng: {type:Number, required: true},
        }
    },

    date: {
        type: Date,
        default: Date.now
    }
})

const NewReminder = mongoose.model('NewReminder', NewReminderSchema)
module.exports = NewReminder