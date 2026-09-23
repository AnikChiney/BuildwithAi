const multer = require("multer");

const errorHandler = (error, req, res, next) => {
    console.error(error);

    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({ message: "Audio file is too large" });
        }
        return res.status(400).json({ message: error.message });
    }

    if (
        error.message === "Only audio files are supported" ||
        error.message === "Invalid JSON"
    ) {
        return res.status(400).json({ message: error.message });
    }

    if (
        error.message?.includes("GEMINI_API_KEY") ||
        error.message?.includes("AI returned") ||
        error.message?.includes("Speech-to-text")
    ) {
        return res.status(503).json({
            message: "AI processing is currently unavailable",
            detail:
                process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }

    res.status(500).json({
        message: "Internal server error",
        detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
};

module.exports = errorHandler;
