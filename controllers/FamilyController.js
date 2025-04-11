const Family = require("../models/Family");
const mongoose = require("mongoose");

// Show the list of Families
const index = async (req, res) => {
  try {
    console.log("Fetching all families...");
    const families = await Family.find().lean();
    res.status(200).json(families);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Login - Authenticate family
const login = async (req, res) => {
  try {
    console.log("Processing login...");
    const { familyName, password } = req.body;
    const family = await Family.findOne({ familyName })
      .select("+password")
      .lean();

    if (!family || family.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", family });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Show single family details
const show = async (req, res) => {
  try {
    console.log("Fetching family details...");
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid family ID" });
    }

    const family = await Family.findById(_id).lean();
    if (!family) {
      return res.status(404).json({ message: "Family not found" });
    }

    res.status(200).json(family);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Add new Family
const store = async (req, res) => {
  try {
    console.log("Creating a new family...");
    const { familyName, _id, password, homeIdsArr, familyUsersIdsArr } =
      req.body;

    const newFamily = new Family({
      familyName,
      _id,
      password,
      homeIdsArr,
      familyUsersIdsArr,
    });
    await newFamily.save();

    res
      .status(201)
      .json({ message: "Family created successfully", family: newFamily });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Update Family Details
const update = async (req, res) => {
  try {
    console.log("Updating family details...");
    const { _id, familyName, password, homeIdsArr, familyUsersIdsArr } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid family ID" });
    }

    const updatedFamily = await Family.findByIdAndUpdate(
      _id,
      { familyName, password, homeIdsArr, familyUsersIdsArr },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedFamily) {
      return res.status(404).json({ message: "Family not found" });
    }

    res
      .status(200)
      .json({ message: "Family updated successfully", family: updatedFamily });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Delete a family
const destroy = async (req, res) => {
  try {
    console.log("Deleting family...");
    const { _id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid family ID" });
    }

    const deletedFamily = await Family.findByIdAndDelete(_id);
    if (!deletedFamily) {
      return res.status(404).json({ message: "Family not found" });
    }

    res.status(200).json({ message: "Family deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

module.exports = { index, show, store, update, destroy, login };
