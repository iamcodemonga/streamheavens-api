const User = require('../model/user');
const Likes = require('../model/likes');

exports.authUser = (req, res) => {
    res.json(req.activeUser)
}

exports.userProfile = async(req, res) => {

    let message, favourites, user;

    if (!req.activeUser) {
        message = { status: "failed", statusCode: 405, message: "You are not logged in!" }
        return res.json({ message });
    }

    if( req.activeUser != req.params.id ) {
        message = { status: "failed", statusCode: 405, message: "Invalid user ID!" }
        return res.json({ message });
    }

    message = { status: "ok", statusCode: 200, message: "Welcome to your profile!" }
    favourites = await Likes.find({ userId: req.activeUser._id });
    res.json({ message, favourites, user: req.activeUser });

}

exports.editUser = async(req, res) => {

    let nameRegex = /^([a-zA-Z ]+)$/;
    let emailRegex = /^([a-zA-Z0-9\.\-_]+)@([a-zA-Z0-9\-]+)\.([a-z]{2,10})(\.[a-z]{2,10})?$/;
    let message;
    const { dp, fullname, email, gender, birthday, country } = req.body;
    const { userid } = req.params;
    let user = await User.findById(userid);
    
    if( !userid ) {
        message = { status: "failed", statusCode: 405, message: "You are not logged in!" }
        return res.json({ message });
    }

    if (!fullname|| !email || !gender || !birthday || !country) {
        message = { status: "failed", statusCode: 405, message: "Please fill in all fields!" }
        return res.json({ message });
    }

    if (!nameRegex.test(fullname)) {
        message = { status: "failed", statusCode: 405, message: "Name can only be letters, not numbers or signs!" }
        return res.json({ message });
    }

    if (!emailRegex.test(email)) {
        message = { status: "failed", statusCode: 405, message: "invalid email address, format not proper!" }
        return res.json({ message });
    }

    let existingEmail = await User.exists({ email: email });

    //Email field exists
    if (!user.email && existingEmail) {
        message = { status: "failed", statusCode: 405, message: "Email field does not exist and the address belongs to another!" }
        return res.json({ message });
    }
    
    // email equals currentEmail
    if (user.email != email && existingEmail) {
        message = { status: "failed", statusCode: 405, message: "email already exist!" }
        return res.json({ message });
    }

    //update the database
    if (!dp) {
        try {
            await  User.findByIdAndUpdate(userid, { fullname, email, gender, birthday, country });
            message = { status: "ok", statusCode: 200, message: "Profile updated successfully!" };
            return res.json({ message, user:req.body });
        } catch (error) {
            console.log(error.message)
        }
        
    } else {
        try {
            await  User.findByIdAndUpdate(userid, { dp, fullname, email, gender, birthday, country });
            message = { status: "ok", statusCode: 200, message: "Profile updated successfully!" }
            return res.json({ message, user:req.body });
        } catch (error) {
            console.log(error.message)
        }
    }
}