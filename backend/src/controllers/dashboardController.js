const Report = require("../models/report_model");

const overview = async (_req, res, next) => {
    try {
        const [total, highPriority, categories, districts, languages] =
            await Promise.all([
                Report.countDocuments(),
                Report.countDocuments({ urgency: { $in: ["high", "critical"] } }),
                Report.distinct("category"),
                Report.distinct("location.district"),
                Report.distinct("originalLanguage"),
            ]);

        res.json({
            success: true,
            overview: {
                totalReports: total,
                highPriorityReports: highPriority,
                categories: categories.length,
                districts: districts.length,
                languages: languages.length,
            },
        });
    } catch (error) {
        next(error);
    }
};

const groupCount = (field) => async (_req, res, next) => {
    try {
        const rows = await Report.aggregate([
            { $group: { _id: `$${field}`, count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        res.json({
            success: true,
            data: rows.map((row) => ({
                value: row._id || "Unknown",
                count: row.count,
            })),
        });
    } catch (error) {
        next(error);
    }
};

const hotspots = async (_req, res, next) => {
    try {
        const rows = await Report.aggregate([
            {
                $group: {
                    _id: {
                        state: "$location.state",
                        district: "$location.district",
                        category: "$category",
                    },
                    count: { $sum: 1 },
                    highPriority: {
                        $sum: {
                            $cond: [
                                { $in: ["$urgency", ["high", "critical"]] },
                                1,
                                0,
                            ],
                        },
                    },
                    latitude: { $avg: "$location.latitude" },
                    longitude: { $avg: "$location.longitude" },
                },
            },
            { $sort: { count: -1, highPriority: -1 } },
            { $limit: 50 },
        ]);

        res.json({
            success: true,
            hotspots: rows.map((row) => ({
                state: row._id.state,
                district: row._id.district,
                category: row._id.category,
                reportCount: row.count,
                highPriorityReports: row.highPriority,
                latitude: row.latitude ?? null,
                longitude: row.longitude ?? null,
            })),
        });
    } catch (error) {
        next(error);
    }
};

const recommendations = async (_req, res, next) => {
    try {
        const rows = await Report.aggregate([
            {
                $group: {
                    _id: {
                        state: "$location.state",
                        district: "$location.district",
                        category: "$category",
                    },
                    reportCount: { $sum: 1 },
                    highPriorityReports: {
                        $sum: {
                            $cond: [
                                { $in: ["$urgency", ["high", "critical"]] },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            { $sort: { reportCount: -1, highPriorityReports: -1 } },
            { $limit: 30 },
        ]);

        const interventionMap = {
            Roads: "Road rehabilitation and maintenance",
            Healthcare: "Primary healthcare infrastructure",
            Education: "School infrastructure improvement",
            Water: "Drinking water infrastructure",
            Sanitation: "Sanitation infrastructure improvement",
            Electricity: "Power infrastructure improvement",
            "Public Transport": "Public transport infrastructure",
            Housing: "Affordable housing and basic services",
            Agriculture: "Agricultural infrastructure and support",
            Employment: "Local employment and skill-development support",
            "Digital Connectivity": "Digital connectivity infrastructure",
            Other: "Further assessment of the reported need",
        };

        res.json({
            success: true,
            note: "These are data-driven system suggestions, not official government decisions.",
            recommendations: rows.map((row) => ({
                state: row._id.state,
                district: row._id.district,
                category: row._id.category,
                reportCount: row.reportCount,
                highPriorityReports: row.highPriorityReports,
                suggestedIntervention:
                    interventionMap[row._id.category] || interventionMap.Other,
            })),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    overview,
    categories: groupCount("category"),
    languages: groupCount("originalLanguage"),
    urgency: groupCount("urgency"),
    hotspots,
    recommendations,
};
