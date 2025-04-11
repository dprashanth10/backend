const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

const nodeController = require("../controllers/NodeController");

router.get("/", nodeController.index);
router.post("/store", nodeController.store);
router.post("/update", nodeController.update);
router.post("/delete", nodeController.destroy);
//always put the request with params at the end only
router.post("/show", nodeController.show);
router.post("/filter", nodeController.filterByTimestamp); // New filter route
router.post("/filterByTimeRange", nodeController.filterByTimeRange); // New route filterByTimeRange
router.post("/fireBaseFilter", nodeController.fireBaseData); // New route fireBaseFilter
module.exports = router;
