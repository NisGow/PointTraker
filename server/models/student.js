import mongoose from "mongoose";

const studentSchema = mongoose.Schema({
  name: String,
  points: {
    type: Number,
    default: 0,
  },
});

const Student = mongoose.model("Student", studentSchema);

export default Student;
