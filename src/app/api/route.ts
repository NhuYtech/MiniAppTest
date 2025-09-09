import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  
  let todos;
  if (sortBy === 'deadline') {
    todos = await Todo.find().sort({ deadline: 1, createdAt: -1 });
  } else {
    todos = await Todo.find().sort({ createdAt: -1 });
  }

  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  await connectDB();
  const { text, deadline } = await req.json();
  const newTodo = await Todo.create({ text, deadline });
  return NextResponse.json(newTodo);
}

export async function PUT(req: Request) {
  await connectDB();
  const { id, text } = await req.json();
  const updatedTodo = await Todo.findByIdAndUpdate(id, { text }, { new: true });
  return NextResponse.json(updatedTodo);
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Todo.findByIdAndDelete(id);
  return NextResponse.json({ message: "Todo deleted" });
}