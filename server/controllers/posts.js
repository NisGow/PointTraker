import mongoose from "mongoose";
import Event from "../models/event.js";
import Student from "../models/student.js";

export const getPosts = async (req, res) => {
  try {
    const events = await Event.find();
    console.log(events);
    res.status(200).json(events);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
  //res.send("this works");
};

export const createPost = async (req, res) => {
  const event = req.body;
  var p = event.NumPoints;
  var students = req.body.attendees;
  var stulist = students.split(",");
  const newEvent = new Event({
    title: event.title,
    attendees: event.attendees,
    type: event.type,
    selectedFile: event.selectedFile,
    NumPoints: Number(p),
  });
  var len = stulist.length;
  for (var i = 0; i < len; i++) {
    var n = String(stulist[i]).trim();
    const person = await Student.findOne({ name: n });
    if (person) {
      var np = Number(person.points) + Number(newEvent.NumPoints);
      let doc = await Student.findOneAndUpdate(
        { name: n },
        { points: Number(np) }
      );
    } else {
      const newStudent = new Student({ name: n, points: newEvent.NumPoints });
      await newStudent.save();
    }
  }
  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");
  var op = await Event.findOne({ _id: _id });
  const { title, attendees, type, NumPoints, selectedFile } = req.body;
  var np = Number(NumPoints);
  const up = { title, attendees, type, np, selectedFile, _id: _id };
  const updatedevent = await Event.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        title: title,
        attendees: attendees,
        type: type,
        NumPoints: np,
        selectedFile: selectedFile,
      },
    },
    { new: true }
  );
  if (
    op.NumPoints !== updatedevent.NumPoints ||
    op.attendees !== updatedevent.attendees
  ) {
    const ops = String(op.attendees);
    const oparray = ops.split(",");
    const ups = String(updatedevent.attendees);
    const uparray = ups.split(",");
    for (var i = 0; i < oparray.length; i++) {
      var n = oparray[i].trim();

      const person = await Student.findOne({ name: n });

      var nps = Number(person.points) - Number(op.NumPoints);
      console.log(n + "  " + nps);
      const doc = await Student.findOneAndUpdate(
        { name: n },
        { points: Number(nps) }
      );
      console.log(doc);
    }
    for (var i = 0; i < uparray.length; i++) {
      var n = uparray[i].trim();
      console.log(n);
      const person = await Student.findOne({ name: n });
      console.log(person);
      if (person) var nps = Number(person.points) + Number(np);
      let doc = await Student.findOneAndUpdate(
        { name: n },
        { points: Number(nps) },
        { upsert: true }
      );
      console.log(" updated" + doc);
    }
  }
  res.status(200).json(updatedevent);
};

export const deletePost = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("No post with that id");
  var op = await Event.findByIdAndRemove(_id);
  const ops = String(op.attendees);
  const oparray = ops.split(",");
  for (var i = 0; i < oparray.length; i++) {
    var n = oparray[i].trim();

    const person = await Student.findOne({ name: n });

    if (person) var nps = Number(person.points) - Number(op.NumPoints);
    console.log(n + "  " + nps);
    const doc = await Student.findOneAndUpdate(
      { name: n },
      { points: Number(nps) }
    );
  }
  console.log("delete");
  res.json({ message: "Post deleted successfully" });
};
