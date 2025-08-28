import { Router } from "express";
import Project from "../models/Project.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// Create
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.create({ title, description, user: req.user.id });
    res.json(project);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Read all for current user
router.get("/", auth, async (req, res) => {
  const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(projects);
});

// Read one
router.get("/:id", auth, async (req, res) => {
  const p = await Project.findOne({ _id: req.params.id, user: req.user.id });
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

// Update
router.put("/:id", auth, async (req, res) => {
  const p = await Project.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: { title: req.body.title, description: req.body.description } },
    { new: true }
  );
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  const r = await Project.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!r) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
