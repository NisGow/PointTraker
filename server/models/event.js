import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
  title: String,
  creator: String,
  name: String,
  attendees: String,
  type: String,
  selectedFile: String,
  NumPoints: {
    type: Number,
    default: 1,
  },
  EventDate: {
    type: Date,
    default: new Date(),
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
