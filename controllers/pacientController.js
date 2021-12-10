const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Pacient = require('./../models/PacientModel')

exports.addPacient = catchAsync(async (req, res, next) => {
    const pacient = await Pacient.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        phone: req.body.phone
    })

    res.status(201).json({
        message: 'success',
        pacient
    })
})

