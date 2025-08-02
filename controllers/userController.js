import User from "../models/userModel.js";
import * as userService from "../services/userService.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redisService.js";
import { get } from "mongoose";


export const createUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);
        const token = user.generateJWT(); // Generate JWT for the user
        delete user._doc.password; // Remove password from the response
        return res.status(201).json({user,token});
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}



export const loginUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password"); 
        // Ensure password is included for comparison
        if (!user) {
            return res.status(401).send({ error: "Invalid email or password" });
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).send({ error: "Invalid email or password" });
        }
        const token = user.generateJWT();
        delete user._doc.password; // Remove password from the response
        return res.status(200).json({ user, token });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
}

export const profileController = async (req, res) => {
    res.status(200).json({
        user: req.user, // The user is set in the middleware after verifying the token
        message: "Profile fetched successfully"
    }); 
}


export const logoutController = async (req, res) => {
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Unauthorized User" });
        }
        redisClient.set(token , 'loggedOut', { EX: 3600 }); // Set token as logged out in Redis for 1 hour
        
        return res.status(200).json({ message: "Logout successful" });

    }catch(err){
        console.log("Logout error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getAllUsersController = async (req, res) => {
    
    try{
        const loggedInUser = await User.findOne(req.user.email);

        const allUsers = await userService.getAllUsers({userId : loggedInUser._id}); // Pass the user ID to exclude the current user
        return res.status(200).json({ users: allUsers });
    }
    catch(error){
        console.log("Error fetching all users:", error);
        return res.status(400).json({ error: error.message });
    }
}
