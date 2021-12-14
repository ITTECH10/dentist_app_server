const catchAsync = require('./../utils/catchAsync')
const cloudinary = require('cloudinary').v2
const { uploadFiles } = require('./../utils/cloudinary')

// MIDLEWARE FOR FILES 
exports.checkForFiles = catchAsync(async (req, res, next) => {
    // if(!req.files) next()
    if (req.files) {
        uploadFiles(req)

        await cloudinary.uploader.upload(req.files.joinedTemp, (err, file) => {
            if (file) {
                // console.log(img)
                req.files.image = file.secure_url
            }
            if (err) {
                console.log(err)
            }
        })
    }

    next()
})