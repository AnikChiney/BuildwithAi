const express = require("express");
const {
    overview,
    categories,
    languages,
    urgency,
    hotspots,
    recommendations,
} = require("../controllers/dashboardController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/overview", overview);
router.get("/categories", categories);
router.get("/languages", languages);
router.get("/urgency", urgency);
router.get("/hotspots", hotspots);
router.get("/recommendations", recommendations);

module.exports = router;
