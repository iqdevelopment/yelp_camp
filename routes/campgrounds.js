const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Validators = require('../validateSchemas/index')
const { isLoggedIn,isAuthor } = require('../utils/authorization')
const campgrounds = require('../controllers/campgrounds')
//file upload
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })





router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,/* Validators.validateCampground, */ upload.array('images'),  catchAsync(campgrounds.createCampground))
     /* .post( upload.array('images'), (req,res) => {

        console.log(req.body)
        res.send( req.body)
    })  */

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get( catchAsync(campgrounds.showCampground) )
    .put(isLoggedIn, isAuthor ,upload.array('images'), /* Validators.validateCampground ,*/ catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor,catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn , isAuthor,catchAsync(campgrounds.editForm))




module.exports = router