const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/Review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn } = require('../middleware')
const review = require('../controllers/review')

router.post('/', isLoggedIn, catchAsync(review.createReview))
router.delete('/:reviewId', isLoggedIn, catchAsync(review.deleteReview));

module.exports = router;