const User = require('../model/user');
const Likes = require('../model/likes');

exports.userFavourites = async(req, res) => {

    let message;
    const { userid } = req.params;

    if (!userid) {
        message = { status: "failed", statusCode: 405, message: "You are not logged in!" }
        return res.json({ message });
    }

    const favourites = await Likes.find({ userId: userid});
    message = { status: "ok", statusCode: 200, message: "successful!" }
    return res.json({ message, favourites })

}

exports.Like = async(req, res) => {

    const { poster, title, released, series } = req.body;
    const userId = req.params.userid;
    let message;

    if (!poster && !title && !released && !series ) {
        message = { status: "failed", statusCode: 405, message: "fill in all fields!" }
        return res.json({ message });
    }

    if (await Likes.exists({ poster })) {
        
        try {
            //delete from database
            const deleteLike = await Likes.deleteOne({ userId, poster }).exec();
            console.log(deleteLike)
            //remove from user favourites
            await User.findByIdAndUpdate(userId, { $pull: { favourites: poster } })
            message = { status: "ok", statusCode: 200, message: "removed!" }
            return res.json({ message });
        } catch(error) {
            console.log(error.message)
        }
        
    } else {

        try {
            //add to database
            const createLike = await Likes.create({userId, poster, title, released, series});
            console.log(createLike)
            // add to user favourites
            await User.findByIdAndUpdate(userId, { $addToSet: { favourites: poster } })
            message = { status: "ok", statusCode: 200, message: "added!" }
            return res.json({ message });
        } catch(error) {
            console.log(error.message)
        }
    }

}