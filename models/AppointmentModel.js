const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    pacientId: {
        type: mongoose.Schema.ObjectId
    },
    date: {
        type: Date
    },
    note: {
        type: String
    }
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment