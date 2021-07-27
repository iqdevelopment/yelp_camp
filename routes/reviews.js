const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const Validators = require('../validateSchemas/index')
const Campground = require('../models/campground')
const Review = require('../models/reviews')
const ExpressError = require('../utils/ExpressError')
const {isLoggedIn,isAuthor} = require('../utils/authorization')
const reviews = require('../controllers/reviews')


router.delete('/:reviewid',isLoggedIn ,isAuthor , catchAsync(reviews.deleteReview))


router.post('/',isLoggedIn, isAuthor, Validators.validateReview, catchAsync(reviews.createReview))

module.exports = router