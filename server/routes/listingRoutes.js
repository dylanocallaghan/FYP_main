const express = require("express");
const router = express.Router();
const { createListing } = require("../controllers/listingController");

router.post("/create", createListing);

module.exports = router;
