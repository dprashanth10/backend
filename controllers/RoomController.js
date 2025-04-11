const Room = require("../models/Room");
const mongoose = require("mongoose");

// Get All Rooms
const index = async (req, res) => {
  try {
    console.log("Fetching all rooms...");
    const rooms = await Room.find({ isDeleted: { $ne: true } }).lean();
    res.status(200).json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Get a Single Room by ID
const show = async (req, res) => {
  try {
    console.log("Fetching room details...");
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const room = await Room.findOne({ _id, isDeleted: { $ne: true } }).lean();
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Add a New Room
const store = async (req, res) => {
  try {
    console.log("Saving new room...");
    const { roomName, roomIdsArr, userIdsPresent } = req.body;

    const newRoom = new Room({ roomName, roomIdsArr, userIdsPresent });
    await newRoom.save();

    res.status(201).json({ message: "Room saved successfully", room: newRoom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Update Room Details
const update = async (req, res) => {
  try {
    console.log("Updating room details...");
    const { _id, nodeIdsArr, roomName, roomIdsArr, userIdsPresent } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      _id,
      { $set: { nodeIdsArr, roomName, roomIdsArr, userIdsPresent } },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res
      .status(200)
      .json({ message: "Room updated successfully", room: updatedRoom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Soft Delete a Room
const destroy = async (req, res) => {
  try {
    console.log("Soft deleting room...");
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const deletedRoom = await Room.findByIdAndUpdate(
      _id,
      { $set: { isDeleted: true } },
      { new: true }
    ).lean();

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ message: "Room marked as deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

module.exports = { index, show, store, update, destroy };
