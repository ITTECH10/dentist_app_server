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
        type: String,
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} nije spol!'
        },
    },
    phone: {
        type: String
    },
    pacientImage: {
        type: String
    }
})

const Pacient = mongoose.model('Pacient', pacientSchema)

module.exports = Pacient