const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const familyRoute = require("./routes/family");
const homeRoute = require("./routes/home");
const roomRoute = require("./routes/room");
const nodeRoute = require("./routes/node");

const app = express();
const PORT = process.env.PORT || 3500;

// Database Connection with Error Handling
// const connectDB = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://praneeth130204:praneeth130204@cluster1.rmcts.mongodb.net/",
//       {
//         serverSelectionTimeoutMS: 30000,
//         socketTimeoutMS: 60000,
//         useUnifiedTopology: true,
//         maxPoolSize: 5,
//       }
//     );
//     console.log("✅ Connected to Database");
//   } catch (err) {
//     console.error("❌ Database Connection Error:", err);
//     process.exit(1); // Exit on failure
//   }
// };

const connectDB = async () => {
  let retries = 5; // Number of retries
  while (retries) {
    try {
      await mongoose.connect(
        "mongodb+srv://praneeth130204:praneeth130204@cluster1.rmcts.mongodb.net/",
        {
          serverSelectionTimeoutMS: 120000,
          socketTimeoutMS: 120000,
        }
      );
      console.log("✅ Connected to Database");
      break; // Exit loop on success
    } catch (err) {
      console.error("❌ Database Connection Error:", err);
      retries -= 1;
      console.log(`Retrying... (${5 - retries}/5)`);
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }
  if (!retries) process.exit(1); // Exit if all retries fail
};

mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to the database");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("❌ Mongoose disconnected from the database");
});

// ,
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       }
connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Middleware
app.use(morgan("dev")); // Logging requests
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON requests

// Disable caching for all responses
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Routes
app.use("/api/family", familyRoute);
app.use("/api/home", homeRoute);
app.use("/api/room", roomRoute);
app.use("/api/node", nodeRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on PORT ${PORT}`);
});
