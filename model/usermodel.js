const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const userModel = mongoose.model("projectuser",userSchema)

module.exports = {userModel}