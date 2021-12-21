const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Diagnosis = require('../models/DiagnosisModel')
const cloudinary = require('cloudinary').v2

exports.createDiagnosis = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params

    const newDiagnosis = await Diagnosis.create({
        pacientId,
        employeeId: req.user._id,
        date: req.body.date,
        summary: req.body.summary,
        image: req.files ? req.files.image : req.body.image,
        kind: req.body.kind,
        ordination: req.body.ordination,
        tooth: req.body.tooth
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

exports.getOneDiagnosis = catchAsync(async (req, res, next) => {
    const { diagnosisId } = req.params
    const diagnosis = await Diagnosis.find({ _id: diagnosisId })

    if (!diagnosis) {
        return next(new AppError('Dijagnoza nije pronađena', 404))
    }

    res.status(200).json({
        message: 'success',
        diagnosis
    })
})

exports.getPacientDiagnosis = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params
    const diagnosis = await Diagnosis.find({ pacientId })

    if (!diagnosis) {
        return next(new AppError('Nijedna dijagnoza nije pronađena za ovog pacijenta.', 404))
    }

    res.status(200).json({
        message: 'success',
        diagnosis
    })
})

exports.updateDiagnosis = catchAsync(async (req, res, next) => {
    const { diagnosisId } = req.params
    const diagnosis = await Diagnosis.findOne({ _id: diagnosisId })

    if (!diagnosis) {
        return next(new AppError('Dijagnoza nije pronađena', 404))
    }

    diagnosis.pacientId = req.body.pacientId || diagnosis.pacientId
    diagnosis.employeeId = req.body.employeeId || diagnosis.employeeId
    diagnosis.date = req.body.date || diagnosis.date
    diagnosis.summary = req.body.summary || diagnosis.summary
    diagnosis.image = req.files ? req.files.image : diagnosis.image
    diagnosis.kind = req.body.kind || diagnosis.kind
    diagnosis.ordination = req.body.ordination || diagnosis.ordination
    diagnosis.tooth = req.body.tooth || diagnosis.tooth

    await diagnosis.save({ validateBeforeSave: false })

    res.status(200).json({
        message: 'success',
        diagnosis
    })
})

exports.deleteDiagnosis = catchAsync(async (req, res, next) => {
    const { diagnosisId } = req.params
    const diagnosis = await Diagnosis.findOne({ _id: diagnosisId })
    const publicId = diagnosis.image.split('/')[7].split('.')[0]

    if (!diagnosis) {
        return next(new AppError('Dijagnozu nije moguće obrisati. Za pomoć kontaktirajte korisničku podršku.', 404))
    }

    try {
        await Diagnosis.findByIdAndDelete(diagnosisId)

        await cloudinary.api.delete_resources(publicId, { invalidate: true },
            function (error, result) {
                if (error) {
                    console.log(error)
                }
            });
    } catch (err) {
        console.log(err)
    }

    res.status(204).json({
        message: 'success'
    })
})
