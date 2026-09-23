const Report = require("../models/report_model");
const { processText } = require("../services/languageService");
const { transcribeAudio } = require("../services/speechService");

const validateLocation = (location) => {
    if (!location || typeof location !== "object") {
        throw new Error("Location is required");
    }

    if (!location.state || !location.district) {
        throw new Error("Location state and district are required");
    }

    if (
        location.latitude !== undefined &&
        (Number.isNaN(Number(location.latitude)) ||
            Number(location.latitude) < -90 ||
            Number(location.latitude) > 90)
    ) {
        throw new Error("Invalid latitude");
    }

    if (
        location.longitude !== undefined &&
        (Number.isNaN(Number(location.longitude)) ||
            Number(location.longitude) < -180 ||
            Number(location.longitude) > 180)
    ) {
        throw new Error("Invalid longitude");
    }

    return {
        state: String(location.state).trim(),
        district: String(location.district).trim(),
        latitude:
            location.latitude !== undefined ? Number(location.latitude) : undefined,
        longitude:
            location.longitude !== undefined ? Number(location.longitude) : undefined,
    };
};

const createTextReport = async (req, res, next) => {
    try {
        const { text, location } = req.body;

        if (!text || !String(text).trim()) {
            return res.status(400).json({ message: "Text is required" });
        }

        const normalizedLocation = validateLocation(location);
        const processed = await processText(text);

        const report = await Report.create({
            submittedBy: req.user._id,
            inputType: "text",
            originalLanguage: processed.originalLanguage,
            originalText: String(text).trim(),
            transcription: null,
            englishText: processed.englishText,
            audioUrl: null,
            category: processed.category,
            subcategory: processed.subcategory,
            summary: processed.summary,
            urgency: processed.urgency,
            keywords: processed.keywords,
            location: normalizedLocation,
            processingStatus: "completed",
        });

        res.status(201).json({ success: true, report });
    } catch (error) {
        next(error);
    }
};

const createVoiceReport = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Audio file is required" });
        }

        const normalizedLocation = validateLocation(
            req.body.location
                ? typeof req.body.location === "string"
                    ? JSON.parse(req.body.location)
                    : req.body.location
                : null
        );

        const transcription = await transcribeAudio(
            req.file.path,
            req.file.mimetype
        );
        const processed = await processText(transcription);

        const report = await Report.create({
            submittedBy: req.user._id,
            inputType: "voice",
            originalLanguage: processed.originalLanguage,
            originalText: transcription,
            transcription,
            englishText: processed.englishText,
            audioUrl: `/uploads/reports/${req.file.filename}`,
            category: processed.category,
            subcategory: processed.subcategory,
            summary: processed.summary,
            urgency: processed.urgency,
            keywords: processed.keywords,
            location: normalizedLocation,
            processingStatus: "completed",
        });

        res.status(201).json({ success: true, report });
    } catch (error) {
        if (req.file) {
            const fs = require("fs/promises");
            await fs.unlink(req.file.path).catch(() => {});
        }
        next(error);
    }
};

const listReports = async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.category) filter.category = req.query.category;
        if (req.query.language) filter.originalLanguage = req.query.language;
        if (req.query.urgency) filter.urgency = req.query.urgency;
        if (req.query.district) filter["location.district"] = req.query.district;

        const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
        const page = Math.max(Number(req.query.page) || 1, 1);

        const [reports, total] = await Promise.all([
            Report.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("submittedBy", "name email"),
            Report.countDocuments(filter),
        ]);

        res.json({
            success: true,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
            reports,
        });
    } catch (error) {
        next(error);
    }
};

const getReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id).populate(
            "submittedBy",
            "name email"
        );

        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }

        res.json({ success: true, report });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTextReport,
    createVoiceReport,
    listReports,
    getReport,
};
