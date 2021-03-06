const express = require('express')
const appointmentController = require('./../controllers/appointmentController')
const authController = require('./../controllers/authController')

const router = express.Router({ mergeParams: true })

// RESTRICTIONS
router.use(authController.protect)
router.use(authController.restrictTo('director', 'deputy', 'assistant'))

router.route('/upcoming')
    .get(appointmentController.getUpcomingAppointments)

router.route('/')
    .get(appointmentController.getAllAppointments)
    .post(appointmentController.createAppointment)

router.route('/deleteMultiple')
    .delete(appointmentController.bulkDeleteAppointments)

router.route('/:appointmentId')
    .get(appointmentController.getOneAppointment)
    .put(appointmentController.updateAppointment)
    .delete(appointmentController.deleteAppointment)

// ROUTES BELLOW ARE PACIENT DEPENDENT //NEED TO MERGE PARAMS OR BETTER SOLUTION
// router.route('/:pacientId')
//     .get(appointmentController.getPacientAppointments)

module.exports = router