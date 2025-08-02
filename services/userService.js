import User from "../models/userModel.js";

export const createUser = async ({
    email,
    password,
    }) => {
        if (!email || !password) {
            throw new Error("Email and password are required");
        }

        const user = await User.create({
            email,
            password: await User.hashPassword(password), // Hash the password before saving
        })
 
    return user;
};

export const getAllUsers = async ({userId}) => {
    const users = await User.find({
        _id: { $ne: userId } // Exclude the current user
    })
    return users;
}