const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    pacientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Pacient'
    },
    employeeId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Employee'
    },
    date: {
        type: Date
    },
    note: {
        type: String
    }
})

// TTL INDEX
appointmentSchema.index({ "date": 1 }, { expireAfterSeconds: 10 })

appointmentSchema.pre(/^find/, function (next) {
    this.populate('pacientId', 'firstName lastName')
    next()
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment