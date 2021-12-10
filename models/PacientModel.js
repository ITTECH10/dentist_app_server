const mongoose = require('mongoose')

const pacientSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    birthDate: {
        type: Date
    },
    gender: {
        type: String
    },
    phone: {
        type: String
    }
})

const Pacient = mongoose.model('Pacient', pacientSchema)

module.exports = Pacient