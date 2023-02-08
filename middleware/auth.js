const User = require('../model/user')

const loggedInUser = async(req, res, next) => {

    let user;

    if ( req.isAuthenticated()) {

        try {
            user = await User.findById(req.user._id);
            let { __v, createdAt, updatedAt, ...others } = user._doc;
            req.activeUser = others;
            // next();
        } catch (error) {
            console.log(error)
        }
        
    } else if (req.session.user) {

        try {
            user = await User.findById(req.session.user._id);
            let { __v, password, createdAt, updatedAt, ...others } = user._doc;
            req.activeUser = others;
            // next();
        } catch (error) {
            console.log(error)
        }
        
    } else {
        user = null;
        req.activeUser = user;
    }
    // req.activeUser = user;
    next();
}

const fakeAuth = async(req, res, next) => {

    let user;
    let id = '63d9106156c9c10ab15982ec';

    try {
        user = await User.findById(id);
        let { __v, createdAt, updatedAt, ...others } = user._doc;
        req.activeUser = others;
        console.log(req.activeUser)
        // next();
    } catch (error) {
        console.log(error)
    }

    next();

}

module.exports = { loggedInUser, fakeAuth };