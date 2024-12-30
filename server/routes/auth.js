const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {

        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value
        }

        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            } else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
            console.log(err);
        } 
    }
));

//Google login Route
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

//Google callback Route
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login-failure',
        successRedirect: '/dashboard'
    })
);

//Login Failure Route
router.get('/login-failure', (req, res) => {
    res.send('Login Failed');
});

//Destory user session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.send('Error logging out');
        } else {
            res.redirect('/');
        }
    });
});

//presist user data after successful authentication
passport.serializeUser(function (user, done) {
    done(null, user);
});

//retrieve user data from session
passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
module.exports = router;