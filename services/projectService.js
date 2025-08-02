import mongoose from "mongoose";
import projectModel from "../models/projectModel.js";

export const createProject = async ({ name, userId }) => {
  if (!name) {
    throw new Error("Project name is required");
  }
  if (!userId) {
    throw new Error("User is required");
  }

  try {
    const project = await projectModel.create({
      name,
      users: [userId],
    });
    return project;
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
      throw new Error("Project name already exists");
    }
    throw error;
  }
//return project;
};

export const getAllProjectsByUserID = async ({userId}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const allUserProjects = await projectModel.find({
    users: userId,
  });

  return allUserProjects;
}

export const addUserToProject = async ({ projectId, users , userId}) => {
  if (!projectId) {
    throw new Error("Project ID is required");
  }
  if(!mongoose.Types.ObjectId.isValid(projectId)){
    throw new Error("Invalid Project ID");
  }
  if (!users){
    throw new Error("Users are required");
  } 
  if(!Array.isArray(users) || users.length === 0) {
    throw new Error("Users must be an array of strings");
  }
  if(!userId) {
    throw new Error("User ID is required");
  }
  if(!mongoose.Types.ObjectId.isValid(userId)){
    throw new Error("Invalid User ID");
  }

  const project = await projectModel.findOne({ 
    _id: projectId,
    users: userId // Ensure the user is part of the project
   });

   if(!project) {
    throw new Error("Project not found or user is not part of the project");  
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } },
    { new: true }
  );

  return updatedProject;
}

export const getProjectById = async ({ projectId }) => {
  if(!projectId) {
    throw new Error("Project ID is required");
  }
  if(!mongoose.Types.ObjectId.isValid(projectId)){
    throw new Error("Invalid Project ID");
  }

  const project = await projectModel.findOne({ _id: projectId })
    .populate("users", "email name") // Populate users with email and name fields

  return project;
  }