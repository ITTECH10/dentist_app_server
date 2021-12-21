const mongoose = require('mongoose')

const diagnosisSchema = mongoose.Schema({
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
    summary: {
        type: String
    },
    image: {
        type: String
    },
    kind: {
        type: String
    },
    ordination: {
        type: String
    },
    tooth: {
        type: String
    }
})

diagnosisSchema.pre(/^find/, function (next) {
    this.populate('employeeId', 'firstName lastName -_id')
    this.populate('pacientId', 'firstName lastName -_id')
    next()
})

const Diagnosis = mongoose.model('Diagnosis', diagnosisSchema)

module.exports = Diagnosis