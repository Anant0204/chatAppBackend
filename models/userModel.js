import mongoose from "mongoose";   
import bcrypt from "bcrypt"; // Import bcrypt for password hashing 
import jsonwebtoken from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Do not return password in queries
  },
});



userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10); // Hash the password with a salt
};

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password); // Compare the provided password with the hashed password
};

userSchema.methods.generateJWT = function () {
    return jsonwebtoken.sign({ email: this._email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const User = mongoose.model("User", userSchema);

export default User;
