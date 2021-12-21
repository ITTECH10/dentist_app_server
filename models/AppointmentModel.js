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

appointmentSchema.pre(/^find/, function (next) {
    this.populate('pacientId', 'firstName lastName _id')
    next()
})

const Appointment = mongoose.model('Appointment', appointmentSchema)

module.exports = Appointment