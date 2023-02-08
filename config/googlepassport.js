const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');
const dotenv = require('dotenv').config();
const User = require('../model/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    let user = await User.findById(id);
    done(null, user)
});

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async(authToken, refreshToken, profile, done) => {

    let newUser = {
        googleId: profile.id,
        dp: profile.photos[0].value,
        fullname: profile.displayName,
    }

    try {

        let existUser = await User.findOne({ googleId: profile.id })

        if (existUser) {
            done(null, existUser);
            
        } else {
            //add user to database 
            let user = await User.create(newUser);
            let { createdAt, updatedAt, ...others } = user._doc;
            done(null, user);
        }

    } catch (error) {
        console.log(error.message)
    }
    
}));