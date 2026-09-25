const fs = require("fs/promises");
const { transcribeAudio } = require("../services/speechService");

// Transcription-only endpoint: no auth required, nothing is persisted.
// Used by the citizen intake flow to turn a recorded voice clip into
// editable text before the request is analysed/submitted.
const transcribeVoice = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Audio file is required" });
        }

        const transcript = await transcribeAudio(
            req.file.path,
            req.file.mimetype
        );

        res.status(200).json({ success: true, transcript });
    } catch (error) {
        next(error);
    } finally {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {});
        }
    }
};

module.exports = { transcribeVoice };
