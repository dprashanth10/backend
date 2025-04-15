const Node = require("../models/Node");
const mongoose = require("mongoose");

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get all Nodes with Pagination
const index = async (req, res) => {
  try {
    console.log("Fetching all nodes...");
    const { page = 1, limit = 10, nodeValue } = req.query; // Get page and limit from query parameters

    const nodes = await Node.find({
      isDeleted: { $ne: true },
      nodeValue: nodeValue,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const totalNodes = await Node.countDocuments({ isDeleted: { $ne: true } });
    // const totalPages = Math.min(Math.ceil(totalNodes / limit), 5); // Limit total pages to 10
    const totalPages = Math.ceil(totalNodes / limit); // Limit total pages to 10

    res.status(200).json({
      data: nodes,
      currentPage: page,
      // totalPages: Math.ceil(totalNodes / limit),
      totalPages: totalPages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Get a Single Node by ID
const show = async (req, res) => {
  try {
    console.log("Fetching node details...");
    const { _id } = req.body;

    if (!isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid node ID" });
    }

    const node = await Node.findOne({ _id, isDeleted: { $ne: true } }).lean();
    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }

    res.status(200).json(node);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

const convertToCustomFormat = (dateTimeString, isEndDate = false) => {
  const date = new Date(dateTimeString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = isEndDate ? "59" : "00"; // Set seconds to 59 for end date and 00 for start date
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const parseDateTime = (dateTimeString) => {
  const [datePart, timePart] = dateTimeString.split(" ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

// Filter Nodes by Timestamp and nodeValue
const filterByTimestamp = async (req, res) => {
  console.log("Filtering by timestamps and nodeValue...");
  const { startDate: start, endDate: end, nodeValue } = req.body;
  console.log("start", start, end, nodeValue);

  const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters

  console.log("start", start, end, nodeValue);

  if (!start || !end || !nodeValue) {
    return res.status(400).json({
      message:
        "start, end, and nodeValue are required fields in the format dd/mm/yyyy hh:mm:ss",
    });
  }

  try {
    // const startDate = parseDateTime(start);
    // const endDate = parseDateTime(end);

    const startDate = parseDateTime(convertToCustomFormat(start));
    const endDate = parseDateTime(convertToCustomFormat(end));

    console.log("start end", startDate, endDate);

    const nodes = await Node.find({
      nodeValue: nodeValue,
      createdAt: { $gte: startDate, $lte: endDate },
      isDeleted: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const totalNodes = await Node.countDocuments({
      nodeValue: nodeValue,
      createdAt: { $gte: startDate, $lte: endDate },
      isDeleted: { $ne: true },
    });

    // const totalPages = Math.min(Math.ceil(totalNodes / limit), 5); // Limit total pages to 5
    const totalPages = Math.ceil(totalNodes / limit); // Limit total pages to 5

    res
      .status(200)
      .json({ data: nodes, currentPage: page, totalPages: totalPages });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Invalid date format. Please use dd/mm/yyyy hh:mm:ss",
    });
  }
};

// started creating filterTimeRangeGraph controller on 10-04-2025
// const filterByTimeRange = async (req, res) => {
//   console.log("Filtering by timestamps and nodeValue...");
//   const { timeRange, nodeValue, endDate } = req.body; // Accept timeRange from the request body
//   // const { page = 1, limit = 10 } = req.query; // Pagination parameters

//   console.log("enddate", endDate);

//   if (!timeRange || !nodeValue) {
//     return res.status(400).json({
//       message: "timeRange and nodeValue are required fields",
//     });
//   }

//   // Calculate startDate based on timeRange
//   const now = new Date();
//   let startDate;

//   switch (timeRange) {
//     case "1h":
//       startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
//       break;
//     case "5h":
//       startDate = new Date(now.getTime() - 5 * 60 * 60 * 1000); // 5 hours ago
//       break;
//     case "1d":
//       startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
//       break;
//     default:
//       return res.status(400).json({ message: "Invalid timeRange value" });
//   }

//   try {
//     const nodes = await Node.find({
//       nodeValue: nodeValue,
//       createdAt: { $gte: startDate },
//       isDeleted: { $ne: true },
//     })
//       .sort({ createdAt: -1 })
//       .lean();

//     // .sort({ createdAt: -1 })
//     // .skip((page - 1) * limit)
//     // .limit(Number(limit))
//     // .lean();

//     // const totalNodes = await Node.countDocuments({
//     //   nodeValue: nodeValue,
//     //   createdAt: { $gte: startDate },
//     //   isDeleted: { $ne: true },
//     // });

//     // const totalPages = Math.ceil(totalNodes / limit);

//     res.status(200).json({ data: nodes });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: `An error occurred: ${err.message}` });
//   }
// };

// const filterByTimeRange = async (req, res) => {
//   console.log("Filtering by timerange and nodeValue...");
//   const { timeRange, nodeValue, startDate, endDate } = req.body; // Accept timeRange from the request body
//   // const { page = 1, limit = 10 } = req.query; // Pagination parameters

//   console.log("startdate and enddate", startDate, endDate);

//   if (!timeRange || !nodeValue) {
//     return res.status(400).json({
//       message: "timeRange and nodeValue are required fields",
//     });
//   }

//   let calcStartDate;
//   let calcEndDate;
//   let now;
//   if (startDate && endDate) {
//     now = new Date(`${endDate}`); // Use endDate as the reference point 2025-04-15T23:36
//     calcEndDate = new Date(now.getTime()); // Use endDate as the reference point
//   } else {
//     // Calculate startDate based on timeRange
//     now = new Date();
//   }

//   switch (timeRange) {
//     case "1h":
//       calcStartDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
//       break;
//     case "5h":
//       calcStartDate = new Date(now.getTime() - 5 * 60 * 60 * 1000); // 5 hours ago
//       break;
//     case "1d":
//       calcStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
//       break;
//     default:
//       return res.status(400).json({ message: "Invalid timeRange value" });
//   }

//   const query = {
//     nodeValue: nodeValue,
//     createdAt: { $gte: calcStartDate },
//     isDeleted: { $ne: true },
//   };

//   if (startDate && endDate) {
//     query.createdAt.$lte = calcEndDate;
//   }

//   try {
//     const nodes = await Node.find(query).sort({ createdAt: -1 }).lean();

//     res.status(200).json({ data: nodes });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: `An error occurred: ${err.message}` });
//   }
// };

const filterByTimeRange = async (req, res) => {
  console.log("Filtering by timerange and nodeValue...");
  const { timeRange, nodeValue, startDate: start, endDate: end } = req.body; // Accept timeRange from the request body
  // const { page = 1, limit = 10 } = req.query; // Pagination parameters

  console.log("startdate and enddate", start, end);

  if (!timeRange || !nodeValue) {
    return res.status(400).json({
      message: "timeRange and nodeValue are required fields",
    });
  }

  if (start && end) {
    console.log("inside start and end", start, end);

    try {
      let endDate = new Date(end);
      let startDate = new Date(end);

      switch (timeRange) {
        case "1h":
          startDate.setHours(endDate.getHours() - 1);
          break;
        case "5h":
          startDate.setHours(endDate.getHours() - 5);
          break;
        case "1d":
          startDate.setDate(endDate.getDate() - 1);
          break;
        default:
          return res.status(400).json({ message: "Invalid timeRange value" });
      }
      console.log("after converting start end", startDate, endDate);

      const query = {
        nodeValue: nodeValue,
        createdAt: { $gte: startDate, $lte: endDate },
        isDeleted: { $ne: true },
      };

      const nodes = await Node.find(query).sort({ createdAt: -1 }).lean();

      res.status(200).json({ data: nodes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `An error occurred: ${err.message}` });
    }
  } else {
    console.log("inside else", start, end);

    let calcStartDate;
    let calcEndDate;
    let now = new Date();

    switch (timeRange) {
      case "1h":
        calcStartDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 hour ago
        break;
      case "5h":
        calcStartDate = new Date(now.getTime() - 5 * 60 * 60 * 1000); // 5 hours ago
        break;
      case "1d":
        calcStartDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1 day ago
        break;
      default:
        return res.status(400).json({ message: "Invalid timeRange value" });
    }

    const query = {
      nodeValue: nodeValue,
      createdAt: { $gte: calcStartDate },
      isDeleted: { $ne: true },
    };

    try {
      const nodes = await Node.find(query).sort({ createdAt: -1 }).lean();

      res.status(200).json({ data: nodes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: `An error occurred: ${err.message}` });
    }
  }
};

// ending filterTimeRangeGraph controller on 10-04-2025

// fetching data from Firebase on 10-04-2025

const fireBaseData = async (req, res) => {
  const { deviceIds, startDate, endDate } = req.body;

  try {
    let query = db.collection("devices").orderBy("timestamp", "desc");

    // Apply filters
    if (startDate) query = query.where("timestamp", ">=", new Date(startDate));
    if (endDate) query = query.where("timestamp", "<=", new Date(endDate));

    const snapshot = await query.get();
    let data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Filter by device IDs if provided
    if (deviceIds?.length) {
      data = data.filter((item) =>
        deviceIds.some((id) => item.device_ids?.includes(id))
      );
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    res.status(500).json({ message: "Failed to fetch data" });
  }
};
// fetching data from Firebase on 10-04-2025
// Add a New Node
const store = async (req, res) => {
  try {
    console.log("Saving new node...");
    const { activityData, nodeValue } = req.body;

    // const count = await Node.countDocuments();
    // const newId = count + 1; // Assign a unique ID

    // const newNode = new Node({ _id: newId, activityData, nodeValue });
    const newNode = new Node({ activityData, nodeValue });
    await newNode.save();

    res.status(201).json({ message: "Node saved successfully", node: newNode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Update Node Details
const update = async (req, res) => {
  try {
    console.log("Updating node details...");
    const { _id, activityData, nodeValue } = req.body;

    if (!isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid node ID" });
    }

    const updatedNode = await Node.findByIdAndUpdate(
      _id,
      { $set: { activityData, nodeValue } },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedNode) {
      return res.status(404).json({ message: "Node not found" });
    }

    res
      .status(200)
      .json({ message: "Node updated successfully", node: updatedNode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

// Soft Delete a Node
const destroy = async (req, res) => {
  try {
    console.log("Soft deleting node...");
    const { _id } = req.body;

    if (!isValidObjectId(_id)) {
      return res.status(400).json({ message: "Invalid node ID" });
    }

    const deletedNode = await Node.findByIdAndUpdate(
      _id,
      { $set: { isDeleted: true } },
      { new: true }
    ).lean();

    if (!deletedNode) {
      return res.status(404).json({ message: "Node not found" });
    }

    res.status(200).json({ message: "Node marked as deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: `An error occurred: ${err.message}` });
  }
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
  filterByTimestamp,
  filterByTimeRange,
  fireBaseData,
};
