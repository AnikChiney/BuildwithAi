const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { transcribeVoice } = require("../controllers/voiceController");

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads", "voice-temp");
fs.mkdirSync(uploadDir, { recursive: true });

const maxAudioSize = Number(process.env.MAX_AUDIO_SIZE_MB || 10) * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || ".webm";
        cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
});

const audioUpload = multer({
    storage,
    limits: { fileSize: maxAudioSize },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype || !file.mimetype.startsWith("audio/")) {
            return cb(new Error("Only audio files are supported"));
        }
        cb(null, true);
    },
});

// No requireAuth here on purpose: the citizen intake flow is unauthenticated
// (see reportRoutes for the authenticated, DB-backed report submission).
router.post("/transcribe", audioUpload.single("audio"), transcribeVoice);

module.exports = router;
