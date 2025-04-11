const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const roomSchema = new Schema(
  {
    nodeValue: {
      type: Number,
      required: true,
    },
    activityData: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // predictionArr:{
    //     type: Array,
    //     "default" : [][10]
    // },
    // probabilityArr:{
    //     type: Array,
    //     "default" : [][10]
    // },
    timestampArr: {
      type: [Date], // Assuming it's an array of timestamps
      required: true,
      default: [],
    },
  },
  { timestamps: true }
);

// Adding necessary indexes for fast querying
// roomSchema.index({ createdAt: -1 }); // Index createdAt for fast sorting by timestamp
// roomSchema.index({ isDeleted: 1 }); // Index for faster filtering on isDeleted

roomSchema.index({ isDeleted: 1, createdAt: -1 }); // Index createdAt for fast sorting by timestamp

const Node = mongoose.model("Node", roomSchema);
module.exports = Node;

// _id: {
//   type: Number,
//   required: true,
//   unique: true,
//   isPrimary: true,
// },
