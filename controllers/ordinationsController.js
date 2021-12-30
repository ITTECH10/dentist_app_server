const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Ordination = require('../models/OrdinationModel')
const cloudinary = require('cloudinary').v2

exports.getAllOrdinations = catchAsync(async (req, res, next) => {
    const ordinations = await Ordination.find()

    if (!ordinations) {
        return next(new AppError('Nijedna ordinacija nije pronađena', 404))
    }

    res.status(200).json({
        message: 'success',
        numberOfResults: ordinations.length,
        ordinations
    })
})

exports.getOneOrdination = catchAsync(async (req, res, next) => {
    const { ordinationId } = req.params
    const ordination = await Ordination.findOne({ _id: ordinationId })

    if (!ordination) {
        return next(new AppError('Ordinacija nije pronađena.', 404))
    }

    res.status(200).json({
        message: 'success',
        ordination
    })
})

exports.createOrdination = catchAsync(async (req, res, next) => {
    const newOrdination = await Ordination.create({
        name: req.body.name,
        location: req.body.location,
        founded: req.body.founded,
        image: req.files ? req.files.image : req.body.image
    })

    res.status(201).json({
        message: 'success',
        newOrdination
    })
})

exports.updateOrdination = catchAsync(async (req, res, next) => {
    const { ordinationId } = req.params
    const updatingOrdination = await Ordination.findOne({ _id: ordinationId })

    if (!updatingOrdination) {
        return next(new AppError('Došlo je do greške prilikom ažuriranja ordinacije.', 404))
    }

    updatingOrdination.name = req.body.name || updatingOrdination.name
    updatingOrdination.location = req.body.location || updatingOrdination.location
    updatingOrdination.founded = req.body.founded || updatingOrdination.founded

    if (req.files) {
        const publicId = updatingOrdination.image.split('/')[7].split('.')[0]
        updatingOrdination.image = req.files.image || updatingOrdination.image

        await cloudinary.api.delete_resources(publicId, { invalidate: true },
            function (error, result) {
                if (error) {
                    console.log(error)
                }
            });
    }

    await updatingOrdination.save()

    res.status(200).json({
        message: 'success',
        updatingOrdination
    })
})

exports.deleteOrdination = catchAsync(async (req, res, next) => {
    const { ordinationId } = req.params
    const ordination = await Ordination.findOne({ _id: ordinationId })
    let publicId

    if (!ordination) {
        return next(new AppError('Ordinaciju nije moguće obrisati. Za pomoć kontaktirajte korisničku podršku.', 404))
    }

    try {
        await Ordination.findByIdAndDelete(ordinationId)

        if (ordination.image) {
            publicId = ordination.image.split('/')[7].split('.')[0]

            await cloudinary.api.delete_resources(publicId, { invalidate: true },
                function (error, result) {
                    if (error) {
                        console.log(error)
                    }
                });
        }
    } catch (err) {
        console.log(err)
    }

    res.status(204).json({
        message: 'success'
    })
})

exports.bulkDeleteOrdinations = catchAsync(async (req, res, next) => {
    const { ids } = req.body

    ids.map(async ordinationId => {
        const ordination = await Ordination.findById(ordinationId)
        await Ordination.deleteOne({ _id: ordination._id })

        const publicId = ordination.image.split('/')[7].split('.')[0]
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