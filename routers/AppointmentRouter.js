const express = require('express')
const appointmentController = require('./../controllers/appointmentController')
const authController = require('./../controllers/authController')

const router = express.Router()

// RESTRICTIONS
router.use(authController.protect)
router.use(authController.restrictTo('superAdmin', 'admin', 'assistant'))

router.route('/')
    .get(appointmentController.getAllAppointments)

// ROUTES BELLOW ARE PACIENT DEPENDENT //NEED TO MERGE PARAMS OR BETTER SOLUTION
router.route('/pacient/:pacientId')
    .post(appointmentController.createAppointment)
    .get(appointmentController.getPacientAppointments)

router.route('/:appointmentId')
    .put(appointmentController.updateAppointment)
    .delete(appointmentController.deleteAppointment)

module.exports = router