const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
    {
        state: { type: String, trim: true },
        district: { type: String, trim: true },
        latitude: { type: Number, min: -90, max: 90 },
        longitude: { type: Number, min: -180, max: 180 },
    },
    { _id: false }
);

const reportSchema = new mongoose.Schema(
    {
        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        inputType: {
            type: String,
            enum: ["text", "voice"],
            required: true,
            index: true,
        },
        originalLanguage: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        originalText: {
            type: String,
            required: true,
            trim: true,
        },
        transcription: {
            type: String,
            default: null,
        },
        englishText: {
            type: String,
            required: true,
            trim: true,
        },
        audioUrl: {
            type: String,
            default: null,
        },
        category: {
            type: String,
            required: true,
            index: true,
        },
        subcategory: {
            type: String,
            default: "Other",
        },
        summary: {
            type: String,
            required: true,
        },
        urgency: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
            required: true,
            index: true,
        },
        keywords: {
            type: [String],
            default: [],
        },
        location: {
            type: locationSchema,
            required: true,
        },
        processingStatus: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "completed",
            index: true,
        },
        processingError: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

reportSchema.index({ "location.district": 1, category: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
