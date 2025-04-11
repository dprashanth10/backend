const express = require("express");
const router = express.Router();

const familyController = require("../controllers/FamilyController");

router.get("/", familyController.index);
router.post("/login", familyController.login);
router.post("/store", familyController.store);
router.post("/update", familyController.update);
router.post("/delete", familyController.destroy);
//always put the request with params at the end only
router.post("/show", familyController.show);
module.exports = router;
