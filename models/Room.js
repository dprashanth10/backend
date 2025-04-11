const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema(
  {
    roomName: {
      type: String,
    },
    roomDesc: {
      type: String,
    },
    nodeIdsArr: {
      type: Array,
      default: [],
    },
    userIdsPresent: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;

// _id: {
//   type: String,
//   required: true,
//   unique: true,
//   isPrimary: true,
// },
