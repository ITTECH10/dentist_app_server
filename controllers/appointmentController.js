const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Appointment = require('../models/AppointmentModel')
const Pacient = require('../models/PacientModel')
const DateGenerator = require('../utils/DateGenerator')

// TODO:
// LATER IMPLEMENT BETTER ROUTE SECURITY

exports.createAppointment = catchAsync(async (req, res, next) => {
    const { pacientId } = req.params
    const pacient = await Pacient.findOne({ _id: pacientId })

    if (!pacient) {
        return next(new AppError('Dogodila se greška pri dodavanju termina za ovog pacijenta.', 404))
    }

    const newAppointment = await Appointment.create({
        pacientId,
        employeeId: req.user._id,
        date: req.body.date,
        note: req.body.note,
    })

    res.status(201).json({
        message: 'success',
        newAppointment,
        pacientName: `${pacient.firstName} ${pacient.lastName}`
    })
})

exports.getAllAppointments = catchAsync(async (req, res, next) => {
    // Get last 25 appointments always
    const appointments = await Appointment.find().limit(50).sort({ date: 1 })

    if (!appointments) {
        return next(new AppError('Nijedan termin nije pronađen.'))
    }

    res.status(200).json({
        message: 'success',
        numberOfResults: appointments.length,
        appointments
    })
})

exports.getOneAppointment = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params
    const appointment = await Appointment.findOne({ _id: appointmentId })

    if (!appointment) {
        return next(new AppError('Termin nije pronađen.', 404))
    }

    res.status(200).json({
        appointment
    })
})

exports.updateAppointment = catchAsync(async (req, res, next) => {
    const { appointmentId } = req.params
    const updatedAppointment = await Appointment.findOne({ _id: appointmentId })

    updatedAppointment.pacientId = req.body.pacientId || updatedAppointment.pacientId._id
    updatedAppointment.date = req.body.date || updatedAppointment.date
    updatedAppointment.note = req.body.note || updatedAppointment.note

    await updatedAppointment.save({ validateBeforeSave: true })

    res.status(200).json({
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

exports.getUpcomingAppointments = catchAsync(async (req, res, next) => {
    // DO IT IN AGGREGATION // OR NOT (language agnostic)
    // 1) Get all appointments where date is > NOW and  <= one month from now
    const monthsFromNow = new DateGenerator().monthsFromNow(1)
    const results = await Appointment.find({ date: { $gte: new Date(), $lte: monthsFromNow } })

    // const results = await Appointment.aggregate([
    //     {
    //         $match: { date: { $gte: new Date(), $lte: monthsFromNow } }
    //     },
    //     {
    //         $lookup: {
    //             from: "pacients",
    //             localField: "pacientId",
    //             foreignField: "_id",
    //             as: "pacientName"
    //         }
    //     },
    //     {
    //         $unwind: {
    //             path: '$pacientName'
    //         }
    //     },
    //     // {
    //     //     $sum: { "pacientName": "$pacientName.firstName" + ' ' + "$pacientName.lastName" }
    //     // }
    //     {
    //         $addFields: {
    //             pacientName: { $concat: ['$pacientName.firstName' + ' ' + ' $pacientName.lastName'] }
    //         }
    //     }
    // ])

    res.status(200).json({
        message: 'success',
        results
    })
})