const express = require("express");
const router = express.Router();

const homeController = require("../controllers/HomeController");

router.get("/", homeController.index);
router.post("/store", homeController.store);
router.post("/update", homeController.update);
router.post("/delete", homeController.destroy);
//always put the request with params at the end only
router.post("/show", homeController.show);
module.exports = router;
