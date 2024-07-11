const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const campground = require('../controllers/campground');
const multer=require('multer');
const {storage}=require('../cloudinary');
const { validateCampground } = require('../models/validateSchema');
const upload=multer({storage});

// router.use((err, req, res, next) => {
//     let { message, statusCode = 500 } = err;
//     if (!message) { message = "Something went wrong" }
//     res.status(statusCode).render('error', { message })
// })

router.route('/')
.get(catchAsync(campground.index))
.post(isLoggedIn,upload.single('image'),catchAsync(campground.createCampground))


router.get('/new', isLoggedIn, catchAsync(campground.renderNewform))
router.route('/:id')
.put(isLoggedIn,upload.single('image'), catchAsync(campground.showCampground))
.delete(isLoggedIn, catchAsync(campground.deleteCampground))
.get( catchAsync(campground.renderCampground))

router.get('/:id/edit', isLoggedIn, catchAsync(campground.updatedCampground))



module.exports = router;