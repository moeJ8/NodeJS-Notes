const express = require("express");
const router = express.Router();
const mainController = require("../controllers/mainController");

//ROUTES
router.get("/", mainController.homepage);
router.get("/about", mainController.about);
router.get("/faqs", mainController.faqs);
router.get("/features", mainController.features);

module.exports = router;