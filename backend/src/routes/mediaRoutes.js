const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");

const {
    createMediaRecords,
    listReportMedia,
    deleteMedia,
} = require("../controllers/mediaController");

const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

const imageDir = path.join(
    process.cwd(),
    "uploads",
    "reports",
    "images"
);

const videoDir = path.join(
    process.cwd(),
    "uploads",
    "reports",
    "videos"
);

fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const maxImageSize =
    Number(process.env.MAX_IMAGE_SIZE_MB || 10) * 1024 * 1024;

const maxVideoSize =
    Number(process.env.MAX_VIDEO_SIZE_MB || 100) * 1024 * 1024;

const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            return cb(null, imageDir);
        }

        if (file.mimetype.startsWith("video/")) {
            return cb(null, videoDir);
        }

        cb(new Error("Unsupported media type"));
    },

    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || "";

        const safeName = `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}${ext}`;

        cb(null, safeName);
    },
});

const mediaUpload = multer({
    storage,

    limits: {
        files: 5,

        // The actual per-file size is checked below because
        // images and videos have different limits.
        fileSize: maxVideoSize,
    },

    fileFilter: (_req, file, cb) => {
        const allowedImages = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        const allowedVideos = [
            "video/mp4",
            "video/webm",
            "video/quicktime",
        ];

        if (
            allowedImages.includes(file.mimetype) ||
            allowedVideos.includes(file.mimetype)
        ) {
            return cb(null, true);
        }

        cb(
            new Error(
                "Only JPG, PNG, WEBP images and MP4, WEBM, MOV videos are supported"
            )
        );
    },
});

router.use(requireAuth);

router.post(
    "/reports/:id/media",
    mediaUpload.array("media", 5),
    async (req, res, next) => {
        try {
            const files = req.files || [];

            for (const file of files) {
                const isImage = file.mimetype.startsWith("image/");
                const isVideo = file.mimetype.startsWith("video/");

                if (isImage && file.size > maxImageSize) {
                    await fs.promises.unlink(file.path).catch(() => {});

                    for (const remaining of files) {
                        if (remaining.path !== file.path) {
                            await fs.promises
                                .unlink(remaining.path)
                                .catch(() => {});
                        }
                    }

                    return res.status(400).json({
                        message: `Image size cannot exceed ${
                            process.env.MAX_IMAGE_SIZE_MB || 10
                        } MB`,
                    });
                }

                if (isVideo && file.size > maxVideoSize) {
                    await fsPromises.unlink(file.path).catch(() => {});

                    for (const remaining of files) {
                        if (remaining.path !== file.path) {
                            await fs.promises
                                .unlink(remaining.path)
                                .catch(() => {});
                        }
                    }

                    return res.status(400).json({
                        message: `Video size cannot exceed ${
                            process.env.MAX_VIDEO_SIZE_MB || 100
                        } MB`,
                    });
                }
            }

            return createMediaRecords(req, res, next);
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    "/reports/:id/media",
    listReportMedia
);

router.delete(
    "/reports/:id/media/:mediaId",
    deleteMedia
);

module.exports = router;