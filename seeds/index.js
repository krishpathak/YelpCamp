const express= require('express');
const connectToMongo = require('../db');
const app=express();
const mongoose= require('mongoose');
const Campground=require('../models/campground')
connectToMongo();
const { descriptors, places } = require('./seedhelpers');
const cities = require('./cities');

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB= async (req,res)=>{
    const random = Math.ceil((Math.random)*800);
    for(let i=0;i<50;i++){
        const camp=new Campground({
            author:'66882f9dec9a7b8bd142406f',
            location:`${cities[i].city}-${cities[i].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:{url: "https://plus.unsplash.com/premium_photo-1709309934434-448b98065f66?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
            description:"The weather is sunny with a clear sky, gentle breeze, and comfortable temperatures. Perfect for outdoor activities, offering a refreshing and pleasant atmosphere for the day. Enjoy the beautiful, mild conditions",
            price:1,
            geometry:{
                type:"Point",
                coordinates:[ cities[i].longitude,cities[i].latitude ]
            }
        })
        await camp.save()
    }
}
seedDB();
