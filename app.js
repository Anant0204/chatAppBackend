import express from "express";
import connectDB from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import aiRoutes from "./routes/aiRoutes.js";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";

connectDB(); // Connect to the database

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware to parse cookies
app.use("/users", userRoutes); // User routes
app.use("/projects", projectRoutes); // Project routes
app.use("/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
