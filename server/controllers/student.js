import mongoose from "mongoose";
import Event from "../models/event.js";
import Student from "../models/student.js";

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    console.log(students);
    res.status(200).json(students);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
  res.send("this works");
};
