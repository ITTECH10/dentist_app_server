const express = require('express')
const authController = require('./../controllers/authController')
const employeeController = require('./../controllers/employeeController')

const router = express.Router()

router.route('/login')
    .post(authController.login)

// SUPER_ADMIN ONLY
router.use(authController.protect)
router.use(authController.restrictTo('superAdmin'))

router.route('/signup')
    .post(authController.signup)

router.route('/')
    .get(employeeController.getAllEmployees)

router.route('/:employeeId')
    .get(employeeController.getOneEmployee)
    .delete(employeeController.deleteEmployee)
    .put(employeeController.updateEmployeeBaseInfo)


module.exports = router