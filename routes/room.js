const express = require("express");
const router = express.Router();

const roomController = require("../controllers/RoomController");

router.get("/", roomController.index);
router.post("/store", roomController.store);
router.post("/update", roomController.update);
router.post("/delete", roomController.destroy);
//always put the request with params at the end only
router.post("/show", roomController.show);
module.exports = router;
