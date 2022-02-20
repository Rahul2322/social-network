const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },

  avatar: {
    public_id: String,
    url: String,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "password must be atleast 6 characters long"],
    select: false,
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  resetPasswordToken = String,
  resetPasswordExpire = Date,
});

userSchema.pre("save", async function (next) {
  //It means if i am updating only name and save i dont want to hash the hashed password
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function(){

    return jwt.sign({_id:this.id},process.env.JWT_KEY)
}

userSchema.method.getResetPasswordToken = function(){
 const resetToken = crypto.randomBytes(20).toString('hex');
 this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
 this.resetPasswordExpire = Date.now() + 10*60*1000;

 return resetToken;
}
module.exports = mongoose.model("User", userSchema);
