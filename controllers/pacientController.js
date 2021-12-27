const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const Pacient = require('./../models/PacientModel')
const Appointment = require('./../models/AppointmentModel')
const cloudinary = require('cloudinary').v2

exports.addPacient = catchAsync(async (req, res, next) => {
    const pacient = await Pacient.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate,
        address: req.body.address,
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
        .populate('diagnosis', 'date kind tooth ordination -pacientId _id')

    if (!pacient) {
        return next(new AppError('Pacijent nije pronađen.', 404))
    }

    res.status(200).json({
        message: 'success',
        pacient
    })
})

// CONSIDER MOVING TO PACIENTS_CONTROLLER
exports.getPacientAppointments = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params
    const pacient = await Pacient.findOne({ _id: pacientId })

    if (!pacient) {
        return next(new AppError('Pacijent povezan sa ovim terminima nije pronađen.', 404))
    }

    const pacientAppointments = await Appointment.find({ pacientId })

    res.status(200).json({
        message: 'success',
        numberOfResults: pacientAppointments.length,
        pacientAppointments
    })
})

exports.updatePacientBaseInfo = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params
    const updatedPacient = await Pacient.findOne({ _id: pacientId })

    try {
        updatedPacient.firstName = req.body.firstName || updatedPacient.firstName
        updatedPacient.lastName = req.body.lastName || updatedPacient.lastName
        updatedPacient.birthDate = req.body.birthDate || updatedPacient.birthDate
        updatedPacient.gender = req.body.gender || updatedPacient.gender
        updatedPacient.phone = req.body.phone || updatedPacient.phone
        updatedPacient.address = req.body.address || updatedPacient.address

        if (req.files) {
            const publicId = updatedPacient.pacientImage.split('/')[7].split('.')[0]
            updatedPacient.pacientImage = req.files.image || updatedPacient.pacientImage

            await cloudinary.api.delete_resources(publicId, { invalidate: true },
                function (error, result) {
                    if (error) {
                        console.log(error)
                    }
                });
        }

        await updatedPacient.save({ validateBeforeSave: true })
    } catch (err) {
        console.log(err)
    }

    res.status(200).json({
        message: 'success',
        updatedPacient
    })
})

exports.deletePacient = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params
    const pacient = await Pacient.findOne({ _id: pacientId })
    const publicId = pacient.pacientImage.split('/')[7].split('.')[0]

    if (!pacient) {
        return next(new AppError('Pacijenta nije moguće obrisati. Za pomoć kontaktirajte korisničku podršku.', 404))
    }

    try {
        await Pacient.findByIdAndDelete(pacientId)

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