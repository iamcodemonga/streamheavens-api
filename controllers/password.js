const bcrypt = require('bcrypt');
const User = require('../model/user');

exports.editPassword = async(req, res) => {

    const { oldPassword, newPassword, confirmedPassword } = req.body;
    const { userid }  = req.params;
    const user = await User.findById(userid);
    let message;

    if (!userid) {
        message = { status: "failed", statusCode: 405, message: `You are not logged in!` }
        return res.json({ message });
    }

    if (!oldPassword || !newPassword || !confirmedPassword) {
        message = { status: "failed", statusCode: 405, message: "Please fill in all fields!" }
        return res.json({ message });
    }

    let checkPass = async(inputed, real) => {
        let bool = await bcrypt.compare(inputed, real);
        return bool;
    }

    if(await checkPass (oldPassword, user.password) == false) {
        message = { status: "failed", statusCode: 405, message: "Old password is incorrect!" }
        return res.json({ message });
    }

    if (newPassword != confirmedPassword) {
        message = { status: "failed", statusCode: 405, message: "New password does not match the confirmed password!" }
        return res.json({ message });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirmedPassword, salt);
    //Update the database
    try {
        await User.findByIdAndUpdate(userid, { password: hashedPassword })
        message = { status: "ok", statusCode: 405, message: "password changed successfully!" }
        return res.json({ message });
    } catch (error) {
        console.log(error.message)
    }
    
}

exports.forgotPassword = (req, res) => {
    res.send('forgot password')
}

exports.resetPassword = async(req, res) => {
    
    const { newPassword, confirmedPassword } = req.body;
    let message;

    if (!newPassword || !confirmedPassword) {
        message = { status: "failed", statusCode: 405, message: "Please fill in all fields!" }
        return res.json({ message });
    }

    if (newPassword != confirmedPassword) {
        message = { status: "failed", statusCode: 405, message: "New password does not match the confirmrd password!" }
        return res.json({ message });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(confirmedPassword, salt);
    //Update the database
    try {
        await User.findByIdAndUpdate(req.params.id, { password: hashedPassword })
        // Delete the token from PasswordTokens collection
        message = { status: "ok", statusCode: 405, message: "password changed successfully!" }
        return res.json({ message });
    } catch (error) {
        console.log(error.message)
    }

}

exports.resetPage = (req, res) => {

    const { id, token } = req.query;

    // check passtokens collection if the ID matches the TOKEN

    //  if they don't match, redirect to another page

}