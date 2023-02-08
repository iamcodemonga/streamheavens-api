const router = require('express').Router();
const { register, login, logout } = require('../controllers/auth');
const passport = require('passport');
const clientRoot = process.env.CLIENT_ROOT;


router.post('/register', register);

router.post('/login', login);

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/auth/google'}), (req, res) => {
    res.redirect(clientRoot)
});

router.get('/logout', logout)

module.exports = router;