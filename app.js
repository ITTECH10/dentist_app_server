const express = require('express')
const app = express()
const cors = require('cors')
const AppError = require('./utils/appError')
//////////////////////////
const pacientRouter = require('./routers/PacientRouter')
const employeeRouter = require('./routers/EmployeeRouter')
const appointmentRouter = require('./routers/AppointmentRouter')
const diagnosisRouter = require('./routers/DiagnosisRouter')
const ordinationRouter = require('./routers/OrdinationRouter')
const globalErrorHandler = require('./controllers/errorController')
//////////////////////////
const cookieParser = require('cookie-parser')
const os = require('os')
const fileupload = require('express-fileupload')
const compression = require('compression')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

const origin = process.env.NODE_ENV === 'production' ? 'https://dentist-app-client.vercel.app' : 'http://localhost:3000'

// CORS
app.use(cors({ credentials: true, origin }))
app.options('*', cors())

// Set security HTTP headers
app.use(helmet())

// Limit requests from same API
// const limiter = rateLimit({
//     max: 200,
//     windowMs: 60 * 60 * 1000,
//     message: 'Previše zahtjeva sa ove IP adrese, molimo vas pokušajte ponovo za 1h!'
// });

// app.use('/api', limiter);

// Parse cookies
app.use(cookieParser())

// Parsers
app.use(express.json())
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: os.tmpdir()
}));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Response compression middleware
app.use(compression())

// Routes
app.use('/api/v1/pacients', pacientRouter)
app.use('/api/v1/employees', employeeRouter)
app.use('/api/v1/appointments', appointmentRouter)
app.use('/api/v1/diagnosis', diagnosisRouter)
app.use('/api/v1/ordinations', ordinationRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`The requested url ${req.originalUrl} could not be found.`, 404))
})

// Global error handler
app.use(globalErrorHandler)

module.exports = app