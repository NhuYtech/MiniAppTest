// src/models/Todo.ts
import mongoose, { Schema } from "mongoose";

export interface ITodo extends Document {
  text: string;
  completed: boolean;
}

const TodoSchema = new Schema<ITodo>({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.Todo || mongoose.model<ITodo>("Todo", TodoSchema);