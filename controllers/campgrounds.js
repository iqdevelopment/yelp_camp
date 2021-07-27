const Campground = require('../models/campground')
const {cloudinary} = require('../cloudinary/index')
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

/**
 * shows list of all campgrounds
 */

module.exports.index = (async(req, res) => {
    const campgrounds = await Campground.find({}).sort({title: 'asc'})
    res.render('campgrounds/index',{campgrounds})
})


/**
 * creates form for new campground
 */
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}


/**
 * 
 * show campground detail
 */
module.exports.showCampground = async(req, res) => {
    try{
        const campground = await Campground.findById(req.params.id).
        populate({
            path:'reviews',
            populate: {
                path: 'author'
            }
        }).
        populate('author') 
        console.log(campground)
        res.render('campgrounds/show',{campground})
    } catch (e){
            req.flash('error', 'Can not find a campground.')
            return res.redirect('/campgrounds') 
    }
}

/**
 * renders an edit form
 */

module.exports.editForm = async(req, res) => {
    const campground = await Campground.findById(req.params.id)
    const currentUser = req.user._id
    res.render('campgrounds/edit',{campground,currentUser})
}

/**
 * updates campground
 */

module.exports.updateCampground = async(req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    const images = req.files.map (f  => ({url: f.path, filename: f.filename }) )
    campground.images.push(...images )
    if(req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
        console.log(campground )
    }
    await campground.save()
    req.flash('success', 'Successfully updated a campground')
    res.redirect(`/campgrounds/${id}`)
}

/**
 * deletes campground
 */

module.exports.deleteCampground = async(req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash('error', 'Successfully deleted a campground')
    res.redirect(`/campgrounds`)
}

/**
 * creates campground
 */
module.exports.createCampground = async(req, res, next) => {
    const campground = new Campground(req.body.campground)
    const geoData = await geocoder.forwardGeocode({
        query : campground.location,
        limit: 1
    }).send()
    campground.geometry = geoData.body.features[0].geometry
    //loops over req.files and returns object with properities of url and filename
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename }))
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully added a campground')
    res.redirect(`/campgrounds/${campground._id}`)
}