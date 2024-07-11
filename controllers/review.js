const Review= require('../models/Review');
const Campground= require('../models/campground');

module.exports.createReview=async(req,res)=>{
    const {rating,body}=req.body.review;
    const review= new Review({body,rating});
    review.save();
    review.author=req.user._id;
    const id= req.params.id;
    const camp = await Campground.findById(id);
    camp.review.push(review);
    camp.save();
    req.flash('success',"Created new review")
    res.redirect(`/campground/${id}`)
}

module.exports.deleteReview=async(req,res)=>{
    const {reviewId}=req.params;
    const {id}= req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{review:reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash('success',"Succesfully deleted review")
    res.redirect(`/campground/${id}`)
}