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
    address: {
        type: String
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
    },
    checked: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

pacientSchema.virtual('appointments', {
    ref: 'Appointment',
    foreignField: 'pacientId',
    localField: '_id'
});

pacientSchema.virtual('diagnosis', {
    ref: 'Diagnosis',
    foreignField: 'pacientId',
    localField: '_id'
});

const Pacient = mongoose.model('Pacient', pacientSchema)

module.exports = Pacient