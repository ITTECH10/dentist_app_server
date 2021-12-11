const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Appointment = require('../models/AppointmentModel')
const Pacient = require('../models/PacientModel')

// TODO:
// LATER IMPLEMENT BETTER ROUTE SECURITY

exports.createAppointment = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params
    const pacient = await Pacient.findOne({ _id: pacientId })

    if (!pacient) {
        return next(new AppError('Dogodila se greška pri dodavanju termina za ovog pacijenta.', 404))
    }

    if (!pacient._id.equals(pacientId)) {
        return next(new AppError('Dogodila se greška.', 500))
    }

    const newAppointment = await Appointment.create({
        pacientId,
        employeeId: req.user._id,
        date: req.body.date,
        note: req.body.note,
    })

    res.status(201).json({
        message: 'success',
        newAppointment
    })
})

exports.getAllAppointments = catchAsync(async (req, res, next) => {
    const appointments = await Appointment.find()

    if (!appointments) {
        return next(new AppError('Nijedan termin nije pronađen.'))
    }

    res.status(200).json({
        message: 'success',
        numberOfResults: appointments.length,
        appointments
    })
})

// CONSIDER MOVING TO PACIENTS_CONTROLLER
exports.getPacientAppointments = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params
    const pacient = await Pacient.findOne({ _id: pacientId })

    if (!pacient) {
        return next(new AppError('Pacijent povezan sa ovim terminima nije pronađen.', 404))
    }

    if (!pacient._id.equals(pacientId)) {
        return next(new AppError('Dogodila se greška.', 500))
    }

    const pacientAppointments = await Appointment.find({ pacientId })

    res.status(200).json({
        message: 'success',
        numberOfResults: pacientAppointments.length,
        pacientAppointments
    })
})

exports.updateAppointment = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params
    const updatedAppointment = await Appointment.findOne({ _id: appointmentId })

    updatedAppointment.date = req.body.date || updatedAppointment.date
    updatedAppointment.note = req.body.note || updatedAppointment.note
    await updatedAppointment.save({ validateBeforeSave: true })

    res.status(202).json({
        message: 'success',
        updatedAppointment
    })
})

exports.deleteAppointment = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params

    await Appointment.findByIdAndDelete(appointmentId)

    res.status(204).json({
        message: 'success'
    })
})