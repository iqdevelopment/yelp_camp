const Review = require('../models/reviews')
const Campground = require('../models/campground')
const User = require('../models/users')

module.exports.renderRegisterForm =  (req, res) => {
    res.render('users/register')
}

module.exports.renderUserPage =  (req, res) => {
    res.render('users/index')
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'welcome back!')
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo 
    res.redirect(redirectUrl)
}

module.exports.registerUser = async (req, res) => {
    try{
        const {email, username, password} = req.body
        const user = new User({email, username})
        const registerUser = await User.register(user, password)
        
        req.login(registerUser, err => {
            if(err){
                return next(err)
            }
        })
        req.flash('success', 'Wellcome !')
        res.redirect('/users')
    } catch(e){
        req.flash('error', e.message) 
        res.redirect('/users/register')
    }
   
}


module.exports.logout = (req, res) =>{
    req.logout()
    req.flash('success', 'Goodbye !')
    res.redirect('/campgrounds')
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}