const express = require('express')
const authController = require('./../controllers/authController')
const employeeController = require('./../controllers/employeeController')

const router = express.Router()

router.route('/login')
    .post(authController.login)

router.use(authController.protect)
router.route('/me')
    .get(employeeController.getLogedInEmployees)

// ROLE PERMISSIONS FOR BELLOW ROUTES
router.use(authController.restrictTo('director'))

router.route('/signup')
    .post(authController.signup)

router.route('/')
    .get(employeeController.getAllEmployees)

router.route('/:employeeId')
    .get(employeeController.getOneEmployee)
    .delete(employeeController.deleteEmployee)
    .put(employeeController.updateEmployeeBaseInfo)


module.exports = router