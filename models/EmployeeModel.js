const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

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
        type: String,
        enum: {
            values: ['male', 'female'],
            message: '{VALUE} nije spol!'
        },
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
    },
    employeeImage: {
        type: String
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpiresIn: {
        type: String
    },
})

employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)

    next()
})

employeeSchema.methods.comparePasswords = async function (candidatePassword, employeePassword) {
    return await bcrypt.compare(candidatePassword, employeePassword)
};

employeeSchema.methods.createPasswordResetToken = function () {
    const plainToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(plainToken).digest('hex');
    this.passwordResetTokenExpiresIn = Date.now() + 10 * 60 * 1000;

    return plainToken;
};

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee