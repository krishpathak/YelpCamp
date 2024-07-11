const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:"dvpvxjcfk",
    api_key:286473956267266,
    api_secret:"zQa7HNHDlGdyPmCsRcnG2sJpVt4"
})

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
    folder:'Yelpcamp',
    allowedFormats:['jpeg','png','jpg']}
})

module.exports={
    cloudinary,storage
}