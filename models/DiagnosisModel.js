const mongoose = require('mongoose')

const diagnosisSchema = mongoose.Schema({
    pacientId: {
        type: mongoose.Schema.ObjectId
    },
    employeeId: {
        type: mongoose.Schema.ObjectId
    },
    date: {
        type: Date
    },
    summary: {
        type: String
    },
    image: {
        type: String
    }
})

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema)

module.exports = Diagnosis