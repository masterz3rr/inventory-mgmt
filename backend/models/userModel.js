const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    }, 
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be more than 6 characters"],
        maxLength: [12, "Password must not be more than 12 characters"],
    },
    photo: {
        type: String,
        required: [true, "Please add an image"],
        default: "https://www.linkedin.com/feed/?doFeedRefresh=true&nis=true&lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3BiBJH2zsMT9mOBSlNyDmlcw%3D%3D"
    },
    phone: {
        type: String,
        default: "0909"
    },
    bio: {
        type: String,
        maxLength: [150, "Not be more than 150 characters"],
        default: "Bio"
    }
}, {
    timestaps: true
})

const User = mongoose.model("User", userSchema)
module.exports = User