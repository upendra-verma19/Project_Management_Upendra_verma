import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import projectRoutes from "./src/routes/projects.js";
import taskRoutes from "./src/routes/tasks.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CLIENT_ORIGIN?.split(",") || "*",
  credentials: true
}));

// DB
await connectDB();

// Routes
app.get("/", (req, res) => res.json({ message: "Mini Project Manager API" }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API server running on :${PORT}`));
