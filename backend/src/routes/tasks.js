import { Router } from "express";
import Task from "../models/Task.js";
import { auth } from "../middleware/auth.js";

const router = Router();

// Create
router.post("/", auth, async (req, res) => {
  try {
    const { project, title, description, status, dueDate } = req.body;
    const task = await Task.create({
      user: req.user.id, project, title, description, status, dueDate
    });
    res.json(task);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Query with filters (status, dueDate sorting, by project)
router.get("/", auth, async (req, res) => {
  const { project, status, sortByDue = "asc" } = req.query;
  const q = { user: req.user.id };
  if (project) q.project = project;
  if (status) q.status = status;
  const tasks = await Task.find(q).sort({ dueDate: sortByDue === "desc" ? -1 : 1, createdAt: -1 });
  res.json(tasks);
});

// Update
router.put("/:id", auth, async (req, res) => {
  const { title, description, status, dueDate } = req.body;
  const t = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: { title, description, status, dueDate } },
    { new: true }
  );
  if (!t) return res.status(404).json({ message: "Not found" });
  res.json(t);
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  const r = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!r) return res.status(404).json({ message: "Not found" });
  res.json({ ok: true });
});

export default router;
