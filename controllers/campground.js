const Campground = require('../models/campground');
const ExpressError=require('../utils/ExpressError')
const mbxGeocoding =require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken='pk.eyJ1Ijoia3Jpc2hqcGF0aGFrIiwiYSI6ImNseWVxcml4czA1ZWsyanNkenE3cWNpc2wifQ.WHs3UCFBtiEw9DSnaESGdA'
const geocoder= mbxGeocoding({accessToken:mapBoxToken})
module.exports.index = async (req, res) => {
    const campground = await Campground.find({});
    res.render('campgrounds/index', { campground })
}

module.exports.renderNewform = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground =async (req, res, next) => {
    const geoData=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send();
    console.log(geoData.body.features[0].geometry.coordinates)
    const { campground } = req.body;
    const camp = new Campground(campground);
    camp.geometry=geoData.body.features[0].geometry;
    if(req.file){
    camp.image.url = req.file.path;
    camp.image.fileName=req.file.filename}
    camp.author = req.user._id;
    camp.save(); 
    console.log(camp.geometry)
    req.flash('success', 'New campground added');
    res.redirect('/campground')

}
 
module.exports.showCampground = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newCamp = req.body.campground;
        const updatedCamp = await Campground.findByIdAndUpdate(id, newCamp);
        console.log(req.file)
        const geoData=await geocoder.forwardGeocode({
            query:req.body.campground.location,
            limit:1
        }).send();
        updatedCamp.geometry=geoData.body.features[0].geometry;
        if(req.file){
        updatedCamp.image.url=req.file.path;
        updatedCamp.image.fileName=req.file.filename
        updatedCamp.save();
        console.log(updatedCamp)}

        req.flash('success', "Item has been edited");
        res.redirect('/campground')
    }
    catch (e) {
        console.log(e);
        return new ExpressError(404, 'Id not found')
        
    }
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return new ExpressError(404, 'Id not found')
    }
    else {
        const delete1 = await Campground.findByIdAndDelete(id);
        req.flash('success', "successfully deleted campground")
        res.redirect('/campground')
    }
}

module.exports.updatedCampground = async (req, res) => {
    try {
        const { id } = req.params;
        const camp = await Campground.findById(id);
        if (!camp) {
            req.flash('error', 'Not campground exist');
            res.redirect('/campground')
        } else {
            res.render('campgrounds/edit', { camp });
        }
    }
    catch (err) {
        new ExpressError(err, 404)
    }
}

module.exports.renderCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({ path: 'review', populate: { path: 'author' } }).populate('author');
    res.render('campgrounds/show', { campground })
}