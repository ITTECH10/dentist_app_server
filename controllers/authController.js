const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Employee = require('../models/EmployeeModel')
const createSendToken = require('../utils/signToken')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')

exports.signup = catchAsync(async (req, res, next) => {
    const newEmployee = await Employee.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate,
        gender: req.body.gender,
        phone: req.body.phone,
        role: req.body.role,
        email: req.body.email,
        password: req.body.password,
        employeeImage: req.files ? req.files.image : req.body.employeeImage
    })

    res.status(201).json({
        message: 'success',
        newEmployee
    })
})

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Molimo vas unesite e-mail i lozinku.', 400))
    }

    const employee = await Employee.findOne({ email }).select('+password')

    if (!employee || !await employee.comparePasswords(password, employee.password)) {
        return next(new AppError('Netačan e-mail ili lozinka.', 401))
    }

    createSendToken(employee, 200, res)
})

exports.logout = catchAsync(async (req, res, next) => {
    const cookieOptions = {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        // sameSite: 'None',
        // secure: false
        // secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    }

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.sameSite = 'none'
        cookieOptions.secure = true
    }

    res.cookie('jwt', '', cookieOptions);

    res.status(200).json({
        message: 'success'
    });
})

exports.protect = catchAsync(async (req, res, next) => {
    let token
    // if (req.headers.authorization) {
    //     token = req.headers.authorization
    // }

    //FOR POSTMAN TESTING
    // if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    //     token = req.headers.authorization.split(' ')[1]
    // }

    // LATER
    if (req.cookies.jwt) {
        token = req.cookies.jwt
    }

    if (!token) {
        return next(new AppError('Invalid token', 401))
    }

    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const currentEmployee = await Employee.findById(decodedToken.id)

    if (!currentEmployee) {
        return next(new AppError('Korisnik ovog tokena ne postoji.', 404))
    }

    req.user = currentEmployee
    next()
})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('Nemate ovlaštenje da izvršavate ovaj vid akcije.', 403)
            );
        }

        next();
    }
}