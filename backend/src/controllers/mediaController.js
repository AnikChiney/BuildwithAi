const fs = require("fs/promises");
const path = require("path");

const Report = require("../models/report_model");
const Media = require("../models/media_model");

const createMediaRecords = async (req, res, next) => {
    try {
        const { id: reportId } = req.params;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: "At least one image or video is required",
            });
        }

        const report = await Report.findById(reportId);

        if (!report) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => {});
            }

            return res.status(404).json({
                message: "Report not found",
            });
        }

        if (String(report.submittedBy) !== String(req.user._id)) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => {});
            }

            return res.status(403).json({
                message: "You can only add media to your own reports",
            });
        }

        const mediaRecords = req.files.map((file) => {
            const type = file.mimetype.startsWith("image/")
                ? "image"
                : "video";

            const folder = type === "image" ? "images" : "videos";

            return {
                reportId: report._id,
                uploadedBy: req.user._id,
                type,
                originalName: file.originalname,
                fileName: file.filename,
                fileUrl: `/uploads/reports/${folder}/${file.filename}`,
                mimeType: file.mimetype,
                size: file.size,
            };
        });

        const media = await Media.insertMany(mediaRecords);

        res.status(201).json({
            success: true,
            media,
        });
    } catch (error) {
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => {});
            }
        }

        next(error);
    }
};

const listReportMedia = async (req, res, next) => {
    try {
        const { id: reportId } = req.params;

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({
                message: "Report not found",
            });
        }

        const media = await Media.find({ reportId })
            .sort({ createdAt: -1 })
            .lean();

        res.json({
            success: true,
            media,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMedia = async (req, res, next) => {
    try {
        const { id: reportId, mediaId } = req.params;

        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({
                message: "Report not found",
            });
        }

        if (String(report.submittedBy) !== String(req.user._id)) {
            return res.status(403).json({
                message: "You can only delete media from your own reports",
            });
        }

        const media = await Media.findOne({
            _id: mediaId,
            reportId,
        });

        if (!media) {
            return res.status(404).json({
                message: "Media not found",
            });
        }

        const filePath = path.join(
            process.cwd(),
            "uploads",
            "reports",
            media.type === "image" ? "images" : "videos",
            media.fileName
        );

        await fs.unlink(filePath).catch(() => {});

        await media.deleteOne();

        res.json({
            success: true,
            message: "Media deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMediaRecords,
    listReportMedia,
    deleteMedia,
};