const express = require("express");
const { getDataset, getWards } = require("../controllers/datasetController");

const router = express.Router();

// Dataset is intentionally read-only and public because the Government Command
// Center is currently a public decision-support interface.
router.get("/", getDataset);
router.get("/wards", getWards);

module.exports = router;
