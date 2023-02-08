const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const dotenv = require('dotenv').config();
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const passwordRoute = require('./routes/password');
const uploadRoute = require('./routes/fileUpload');
const LikeRoutes = require('./routes/favourites')
const googleSetup = require('./config/googlepassport');

const app = express();
const port = process.env.PORT || 5004
const clientRoot = process.env.CLIENT_ROOT;

app.use(cors({
    origin: [ clientRoot ],
    method: 'GET, POST, PUT, PATCH, DELETE',
    credentials: true,
}))
app.use(express.static('store'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieSession({
    name: 'streamheavens',
    secret: process.env.COOKIE_SECRET,
    maxAge: 90*24*60*60*1000,
    httpOnly: false,
    secure: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true});

app.use('/', userRoute);
app.use('/auth', authRoute);
app.use('/password', passwordRoute);
app.use('/upload', uploadRoute);
app.use('/favourites', LikeRoutes )


app.listen(port, () => {
    console.log(`port listening at point ${port}`);
});