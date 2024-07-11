const mongoose=require('mongoose');
const {Schema} =mongoose;
const passportLocalMongoose=require('passport-local-mongoose')

const schema= new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

schema.plugin(passportLocalMongoose);

module.exports=mongoose.model('Usersdata',schema)