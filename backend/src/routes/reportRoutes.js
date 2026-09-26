const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
    createTextReport,
    createVoiceReport,
    listReports,
    getReport,
} = require("../controllers/reportController");

const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "reports",
    "voice"
);

fs.mkdirSync(uploadDir, { recursive: true });

const maxAudioSize =
    Number(process.env.MAX_AUDIO_SIZE_MB || 10) * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),

    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || ".audio";

        cb(
            null,
            `${Date.now()}-${Math.random()
                .toString(36)
                .slice(2)}${ext}`
        );
    },
});

const audioUpload = multer({
    storage,

    limits: {
        fileSize: maxAudioSize,
    },

    fileFilter: (_req, file, cb) => {
        if (!file.mimetype || !file.mimetype.startsWith("audio/")) {
            return cb(
                new Error("Only audio files are supported")
            );
        }

        cb(null, true);
    },
});

router.use(requireAuth);

router.post("/text", createTextReport);

router.post(
    "/voice",
    audioUpload.single("audio"),
    createVoiceReport
);

router.get("/", listReports);

router.get("/:id", getReport);

module.exports = router;