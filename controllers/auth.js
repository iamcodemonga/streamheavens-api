const User = require('../model/user');
const bcrypt = require('bcrypt');

const register = async(req, res) => {

    let auth, user, checkAuth;
    let nameRegex = /^([a-zA-Z ]+)$/;
    let emailRegex = /^([a-zA-Z0-9\.\-_]+)@([a-zA-Z0-9\-]+)\.([a-z]{2,10})(\.[a-z]{2,10})?$/;
    let phoneRegex = /^([0-9]{5,18})$/;
    let usernameRegex = /^([a-zA-Z0-9\.-_]+)$/;

    try {
        // check for empty fields
        if (!req.body.fullname || !req.body.email || !req.body.password) {
            auth = { status: "failed", statusCode: 405, message: "Please, fill in all fields!" }
            return res.json({ auth, user });
        }

         // test regular expressions
         if (!nameRegex.test(req.body.fullname)) {
            auth = { status: "failed", statusCode: 405, message: "Name can only be letters, not numbers or signs!" }
            return res.json({ auth, user });
        }

        if (!emailRegex.test(req.body.email)) {
            auth = { status: "failed", statusCode: 405, message: "invalid email address, format not proper!" }
            return res.json({ auth, user });
        }

        //check for already existing user (via email)
        checkAuth = await User.findOne({ email: req.body.email});

        if(checkAuth) {

            if(checkAuth.googleId) {
                auth = { status: "failed", statusCode: 405, message: "You already signed up using google, facebook or twitter!" }
                return res.json({ auth, user });
            } else {
                auth = { status: "failed", statusCode: 405, message: "This email already exists!" }
                return res.json({ auth, user });
            }
        }
       
        //hash the password
        const passcode = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash( passcode, salt );
        
        //add user to database 
        auth = { status: "ok", statusCode: 200, message: "Account created successfully!" };
        user = await User.create({ fullname: req.body.fullname, email: req.body.email, password: hashedPassword });
        let { password, createdAt, updatedAt, ...others } = user._doc;

        //sign token and set cookie
        // const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
        // res.cookie('sh', token, { maxAge: 90*24*60*60*1000, sameSite: 'none', httpOnly: true, secure: true });
        req.session.user = { _id: others._id };
        return res.json({ auth, user: others });

    } catch (error) {
        console.log(error.message)
    }

}

const login = async(req, res) => {
    let auth, user;
    let emailRegex = /^([a-zA-Z0-9\.\-_]+)@([a-zA-Z0-9\-]+)\.([a-z]{2,10})(\.[a-z]{2,10})?$/;

    try {
        // check for empty fields
        if (!req.body.email || !req.body.password) {
            auth = { status: "failed", statusCode: 405, message: "Please, fill in all fields!" }
            return res.json({ auth });
        }

        if (!emailRegex.test(req.body.email)) {
            auth = { status: "failed", statusCode: 405, message: "invalid email address, format not proper!" }
            return res.json({ auth });
        }
        
        //check for already existing user (via email)
        let checkPass = async(inputed, real) => {
            let bool = await bcrypt.compare(inputed, real);
            return bool;
        }
        user = await User.findOne({ email: req.body.email});

        if (!user) {
            auth = { status: "failed", statusCode: 405, message: "Email or password is invalid!" }
            return res.json({ auth });
        }

        if(user.googleId) {
            auth = { status: "failed", statusCode: 405, message: "You already signed up using google, facebook or twitter!" }
            return res.json({ auth });
        } 

        if (await checkPass(req.body.password, user.password) === false) {
            auth = { status: "failed", statusCode: 200, message: "Email or password is incorrect!" };
            return res.json({ auth });
        }

        auth = { status: "ok", statusCode: 200, message: "You are logged In!" };
        let { __v, password, createdAt, updatedAt, ...others } = user._doc;
        req.session.user = { _id: others._id };
        return res.json({ auth, user: others });

    } catch (error) {
        console.log(error.message)
    }
}

const logout = (req, res) => {
    if (req.isAuthenticated()) {
        req.session.user = null;
        req.logout();
        res.json({ auth: null})
    }
    req.session.user = null;
    res.json({ auth: null})
}

module.exports = { register, login, logout }