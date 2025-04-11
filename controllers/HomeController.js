const Home = require("../models/Home");
const mongoose = require("mongoose");

// Show the list of Homes
const index = async (req, res) => {
  try {
    console.log("Fetching all homes...");
    const homes = await Home.find().lean();
    res.status(200).json(homes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Show single home details
const show = async (req, res) => {
  try {
    console.log("Fetching home details...");
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid home ID" });
    }

    const home = await Home.findById(_id).lean();
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    res.status(200).json(home);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Add new Home
const store = async (req, res) => {
  try {
    console.log("Creating a new home...");
    const { homeName, _id, roomIdsArr } = req.body;

    const newHome = new Home({ homeName, _id, roomIdsArr });
    await newHome.save();

    res
      .status(201)
      .json({ message: "Home created successfully", home: newHome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Update Home Details
const update = async (req, res) => {
  try {
    console.log("Updating home details...");
    const { _id, homeName, roomIdsArr } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid home ID" });
    }

    const updatedHome = await Home.findByIdAndUpdate(
      _id,
      { homeName, roomIdsArr },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedHome) {
      return res.status(404).json({ message: "Home not found" });
    }

    res
      .status(200)
      .json({ message: "Home updated successfully", home: updatedHome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Delete a Home
const destroy = async (req, res) => {
  try {
    console.log("Deleting home...");
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid home ID" });
    }

    const deletedHome = await Home.findByIdAndDelete(_id);
    if (!deletedHome) {
      return res.status(404).json({ message: "Home not found" });
    }

    res.status(200).json({ message: "Home deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

module.exports = { index, show, store, update, destroy };
