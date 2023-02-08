const router = require('express').Router();
const { editPassword, forgotPassword, resetPassword, resetPage } = require('../controllers/password');

router.post('/forgot', forgotPassword);

router.put('/change/:userid', editPassword);

router.put('/new/:userid', resetPassword);

router.get('/reset', resetPage);

module.exports = router;