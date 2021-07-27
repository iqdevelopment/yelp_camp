const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utils/catchAsync')
const User = require('../models/users')
const passport = require('passport')
const {isLoggedIn,isAuthor} = require('../utils/authorization')
const users = require('../controllers/users')

router.route('/')
    .get( isLoggedIn ,users.renderUserPage)
    .post(catchAsync(users.registerUser))


router.route('/register')
    .get(users.renderRegisterForm)


router.route('/login')
    .get(users.renderLoginForm)
    .post( passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), users.loginUser)




router.get('/logout',users.logout)


module.exports = router