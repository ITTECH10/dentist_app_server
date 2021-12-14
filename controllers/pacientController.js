const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Pacient = require('./../models/PacientModel')

exports.addPacient = catchAsync(async (req, res, next) => {
    const pacient = await Pacient.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        phone: req.body.phone,
        pacientImage: req.files ? req.files.image : req.body.pacientImage,
    })

    res.status(201).json({
        message: 'success',
        pacient
    })
})

exports.getAllPacients = catchAsync(async (req, res, next) => {
    const pacients = await Pacient.find()

    if (!pacients) {
        return next(new AppError('Pacijenti nisu pronađeni.', 404))
    }

    res.status(200).json({
        message: 'success',
        numberOfResults: pacients.length,
        pacients
    })
})

exports.getOnePacient = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params
    const pacient = await Pacient.findOne({ _id: pacientId })

    if (!pacient) {
        return next(new AppError('Pacijent nije pronađen.', 404))
    }

    res.status(200).json({
        message: 'success',
        pacient
    })
})

exports.updatePacientBaseInfo = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params
    const updatedPacient = await Pacient.findOne({ _id: pacientId })

    updatedPacient.firstName = req.body.firstName || updatedPacient.firstName
    updatedPacient.lastName = req.body.lastName || updatedPacient.lastName
    updatedPacient.birthDate = req.body.birthDate || updatedPacient.birthDate
    updatedPacient.gender = req.body.gender || updatedPacient.gender
    updatedPacient.phone = req.body.phone || updatedPacient.phone

    await updatedPacient.save({ validateBeforeSave: true })

    res.status(200).json({
        message: 'success',
        updatedPacient
    })
})

exports.deletePacient = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params

    await Pacient.findByIdAndDelete(pacientId)

    res.status(204).json({
        message: 'success'
    })
})