const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Employee = require('../models/EmployeeModel')
const cloudinary = require('cloudinary').v2

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

    try {
        updatedEmployee.firstName = req.body.firstName || updatedEmployee.firstName
        updatedEmployee.lastName = req.body.lastName || updatedEmployee.lastName
        updatedEmployee.birthDate = req.body.birthDate || updatedEmployee.birthDate
        updatedEmployee.gender = req.body.gender || updatedEmployee.gender
        updatedEmployee.phone = req.body.phone || updatedEmployee.phone
        updatedEmployee.role = req.body.role || updatedEmployee.role

        if (req.files) {
            const publicId = updatedEmployee.employeeImage.split('/')[7].split('.')[0]
            updatedEmployee.employeeImage = req.files.image || updatedEmployee.employeeImage

            await cloudinary.api.delete_resources(publicId, { invalidate: true },
                function (error, result) {
                    if (error) {
                        console.log(error)
                    }
                });
        }

        await updatedEmployee.save({ validateBeforeSave: true })
    } catch (error) {
        console.log(error)
    }

    res.status(200).json({
        message: 'success',
        updatedEmployee
    })
})

exports.deleteEmployee = catchAsync(async (req, res, next) => {
    const { employeeId } = req.params
    const employee = await Employee.findOne({ _id: employeeId })
    const publicId = employee.employeeImage.split('/')[7].split('.')[0]

    if (!employee) {
        return next(new AppError('Zaposlenika nije moguće obrisati. Za pomoć kontaktirajte korisničku podršku.', 404))
    }

    try {
        await Employee.findByIdAndDelete(employeeId)

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

exports.bulkDeleteEmployees = catchAsync(async (req, res, next) => {
    const { ids } = req.body

    ids.map(async employeeId => {
        const employee = await Employee.findById(employeeId)
        const publicId = employee.employeeImage.split('/')[7].split('.')[0]

        await Employee.deleteOne({ _id: employee._id })
        await cloudinary.api.delete_resources(publicId, { invalidate: true },
            function (error, result) {
                if (error) {
                    console.log(error)
                }
            });
    })

    res.status(204).json({
        message: 'success'
    })
})