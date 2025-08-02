import projectModel from "../models/projectModel.js";
import * as projectService from "../services/projectService.js";
import { validationResult } from "express-validator";
import userModel from "../models/userModel.js"; // Import the user model to get the user ID
import { get } from "mongoose";

export const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name } = req.body;
    console.log("Creating project with name:", name);
    const loggedInUser = await userModel.findOne(req.user.email); // Get the logged-in user
    const userId = loggedInUser._id; // Extract the user ID from the user document
    const newProject = await projectService.createProject({ name, userId });
    return res.status(201).json({ newProject });
  } catch (error) {
    console.log("Error creating project:", error);
    return res.status(400).send({ error: error.message });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const loggedInUser = await userModel.findOne(req.user.email);

    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const allUserProjects = await projectService.getAllProjectsByUserID({
      userId: loggedInUser._id, // Pass the user ID
    });
    return res.status(200).json({
      projects: allUserProjects,
    });
  } catch (error) {
    console.log("Error fetching projects:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const addUserToProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { projectId, users } = req.body; // Extract projectId and users from the request body
    console.log("Adding users to project:", projectId, users);

    const loggedInUser = await userModel.findOne(req.user.email); // Get the logged-in user

    const project = await projectService.addUserToProject({
      projectId,
      users,
      userId: loggedInUser._id, // Pass the user ID
    });

    return res.status(200).json({ project });
  } catch (error) {
    console.log("Error adding user to project:", error);
    return res.status(400).json({ error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  const { projectId } = req.params; // Extract projectId from the request parameters

  try {
    const project = await projectService.getProjectById({ projectId });

    return res.status(200).json({ project });
  } catch (error) {
    console.log("Error fetching project by ID:", error);
    return res.status(400).json({ error: error.message });
  }
};
