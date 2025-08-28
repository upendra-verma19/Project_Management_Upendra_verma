import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["todo", "in-progress", "done"], default: "todo" },
    dueDate: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
