const connectToMongo = require('./db');
const express = require('express');
const app = express();
const path = require('path');
const Campground = require('./models/campground');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const helmet = require('helmet')
const session = require('express-session');
const flash = require('connect-flash');
connectToMongo()
app.use(express.json());
const reviewSchema = require('./models/validateSchema')
const methodOverride = require('method-override');
const Review = require('./models/Review');
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
const passport = require('passport');
const LocalStrategy = require('passport-local')
const User = require('./models/userdata');
const { Logged } = require('./middleware');
const MongoStore=require('connect-mongo')
app.use(express.json());

const store=MongoStore.create({
    mongoUrl:'mongodb://localhost:27017',
    secret: 'thisisthesecret',
    touchAfter:24*60*60
})

store.on("error", function(e) {
    console.log("SESSION STORE ERROR", e);
  });

const sessionConfig = {
    store,
    name:'session',
    secret: 'thisisthesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet({contentSecurityPolicy:false}))
// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.tiles.mapbox.com",
//     "https://api.mapbox.com",
//     "https://kit.fontawesome.com",
//     "https://cdnjs.cloudflare.com",
//     "https://cdn.jsdelivr.net",
//     "https://getbootstrap.com/"
// ];

// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com",
//     "https://stackpath.bootstrapcdn.com",
//     "https://api.mapbox.com",
//     "https://api.tiles.mapbox.com",
//     "https://fonts.googleapis.com",
//     "https://use.fontawesome.com",
//     "'unsafe-inline'", // Allow inline styles for Bootstrap
//     "https://getbootstrap.com/"
// ];

// const connectSrcUrls = [
//     "https://api.mapbox.com",
//     "https://*.tiles.mapbox.com",
//     "https://events.mapbox.com",
//     "https://getbootstrap.com/"
// ];

// const fontSrcUrls = [];

// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],
//             styleSrc: ["'self'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             childSrc: ["blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com",
//                 "https://images.unsplash.com",
//                 "https://traveltriangle.com",
//                 "https://static.toiimg.com"
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})
app.use((req, res, next) => {
    if (req.user) {
        res.locals.currentUser = req.user;
    }
    else {
        res.locals.currentUser = null;
    }
    next();
})
const validatereview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        return next(new ExpressError(msg, 400));
    }
    next();
};

const validateCampground = () => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            description: Joi.string(),
            image: Joi.string(),
            location: Joi.string() // Ensure price is non-negative
        }).required()
    });

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        return next(new ExpressError(msg, 400));
    }
}
// app.get('/cookie',(req,res)=>{
//     res.cookie('name', 'krish pathak', { maxAge: 10000 });
//     res.send("cookies send")
// })
app.use('/campground', require('./routes/campground'))
app.use('/campground/:id/review', require('./routes/reviews'));
app.use('/', require('./routes/user'))
app.use((err, req, res, next) => {
    // console.error(err); 
    let { message, statusCode = 500 } = err;
    if (!message) { message = "Something went wrong" }
    next(new ExpressError(message, statusCode))
});

app.use('/home', (req, res) => {
    res.render('\home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { message, statusCode });
});

app.listen(3000, () => {
    console.log("Serving on port 3000")
})

