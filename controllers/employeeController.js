const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Employee = require('../models/EmployeeModel')

exports.getAllEmployees = catchAsync(async (req, res, next) => {
    const employees = await Employee.find()

    if (!employees) {
        return next(new AppError('Nijedan zaposlenik nije pronađen.', 404))
    }

    res.status(200).json({
        message: 'success',
        numberOfResults: employees.length,
        employees
    })
})

exports.getOneEmployee = catchAsync(async (req, res, next) => {
    const { employeeId } = req.params
    const employee = await Employee.findOne({ _id: employeeId })

    if (!employee) {
        return next(new AppError('Zaposlenik nije pronađen.', 404))
    }

    res.status(200).json({
        message: 'success',
        employee
    })
})

exports.getLogedInEmployees = catchAsync(async (req, res, next) => {
    const employee = await Employee.findOne({ _id: req.user._id })

    if (!employee) {
        return next(new AppError('Vaš račun nije pronađen.', 404))
    }

    res.status(200).json({
        message: 'success',
        employee
    })
})

exports.updateEmployeeBaseInfo = catchAsync(async (req, res, next) => {
    const { employeeId } = req.params
    const updatedEmployee = await Employee.findOne({ _id: employeeId })

    updatedEmployee.firstName = req.body.firstName || updatedEmployee.firstName
    updatedEmployee.lastName = req.body.lastName || updatedEmployee.lastName
    updatedEmployee.birthDate = req.body.birthDate || updatedEmployee.birthDate
    updatedEmployee.gender = req.body.gender || updatedEmployee.gender
    updatedEmployee.phone = req.body.phone || updatedEmployee.phone
    updatedEmployee.role = req.body.role || updatedEmployee.role
    await updatedEmployee.save({ validateBeforeSave: true })

    res.status(202).json({
        message: 'success',
        updatedEmployee
    })
})

exports.deleteEmployee = catchAsync(async (req, res, next) => {
    const { employeeId } = req.params
    await Employee.findByIdAndDelete(employeeId)

    res.status(204).json({
        message: 'success'
    })
})