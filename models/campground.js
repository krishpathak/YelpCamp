const mongoose = require('mongoose');
const Review = require('./Review');
const Schema = mongoose.Schema;

// const ImageSchema=new Schema({
//     url:'string',
//     fileName:'string' 
// })

// ImageSchema.virtual('thumbnail').get(function(){
//     return this.url.replace('/upload','/upload/w_200')
// })
//For using we can use image.thumnail which alredy replace 

const campGroundschema = new Schema({
    title: 'string',
    image:{
        url:'string',
        fileName:'string' 
    } ,
    price: {
        type: 'number',
        min: 0
    },
    description: 'string',
    location: 'string',
    review:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    author:{
        type:Schema.Types.ObjectId,
        ref:'Usersdata'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
}) 

campGroundschema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        });
    }
});

module.exports = mongoose.model('Campground', campGroundschema)