const router = require('express').Router();
const { loggedInUser } = require('../middleware/auth')
const { userFavourites, Like } = require('../controllers/favourites')

router.get('/all', loggedInUser, userFavourites)

router.put('/like/:userid', Like);

module.exports = router;