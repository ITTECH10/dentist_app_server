const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Diagnosis = require('../models/DiagnosisModel')

exports.createDiagnosis = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params

    const newDiagnosis = await Diagnosis.create({
        pacientId,
        employeeId: req.user._id,
        date: req.body.date,
        summary: req.body.summary,
        image: req.files ? req.files.image : req.body.image
    })

    res.status(201).json({
        message: 'success',
        newDiagnosis
    })
})

exports.getAllDiagnosis = catchAsync(async (req, res, next) => {
    const diagnosis = await Diagnosis.find()

    if (!diagnosis) {
        return new AppError('Nijedna dijagnoza nije pronađena', 404)
    }

    res.status(200).json({
        message: 'success',
        numberOfResults: diagnosis.length,
        diagnosis
    })
})
