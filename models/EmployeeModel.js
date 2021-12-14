const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const employeeSchema = new mongoose.Schema({
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
    },
    role: {
        type: String,
        enum: {
            values: ['director', 'assistant', 'deputy'],
            message: '{VALUE} pozicija nije podržana!'
        },
        default: 'assistant'
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    }
})

employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)

    next()
})

employeeSchema.methods.comparePasswords = async function (candidatePassword, employeePassword) {
    return await bcrypt.compare(candidatePassword, employeePassword)
};

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee