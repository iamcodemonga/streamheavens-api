const router = require('express').Router();
const { loggedInUser } = require('../middleware/auth');
const { authUser, userProfile, editUser } = require('../controllers/user')

router.get('/', loggedInUser, authUser);

router.get('/:userid',  loggedInUser, userProfile);

router.put('/edit/:userid', editUser);

module.exports  = router;