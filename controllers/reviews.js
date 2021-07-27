const Review = require('../models/reviews')
const Campground = require('../models/campground')

/**
 * deletes review
 */

module.exports.deleteReview = async(req, res) => {
    const {id,reviewid} = req.params
    console.log('deleting')
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewid} } )
    await Review.findByIdAndDelete(reviewid)
    req.flash('success', 'Review was deleted')
    res.redirect(`/campgrounds/${id}`)  
}

/**
 * creates review
 */
module.exports.createReview = async(req, res, next) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user._id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Review was created')
    res.redirect(`/campgrounds/${campground._id}`) 
}