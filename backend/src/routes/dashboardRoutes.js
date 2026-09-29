const express = require("express");
const {
    overview,
    categories,
    languages,
    urgency,
    inputTypes,
    subcategories,
    states,
    districts,
    processingStatus,
    timeline,
    hotspots,
    recommendations,
    recentReports,
    statistics,
} = require("../controllers/dashboardController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);

// Combined endpoint for the dashboard.
// Optional: ?days=30 (7-365) controls the timeline range.
router.get("/statistics", statistics);

router.get("/overview", overview);
router.get("/categories", categories);
router.get("/languages", languages);
router.get("/urgency", urgency);
router.get("/input-types", inputTypes);
router.get("/subcategories", subcategories);
router.get("/states", states);
router.get("/districts", districts);
router.get("/processing-status", processingStatus);
router.get("/timeline", timeline);
router.get("/hotspots", hotspots);
router.get("/recommendations", recommendations);
router.get("/recent-reports", recentReports);

module.exports = router;
