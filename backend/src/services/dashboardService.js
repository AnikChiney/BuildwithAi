const Report = require("../models/report_model");
const Media = require("../models/media_model");

const toCountMap = (rows) =>
    rows.map((row) => ({
        value: row._id || "Unknown",
        count: row.count,
    }));

const groupCount = async (field) => {
    const rows = await Report.aggregate([
        {
            $group: {
                _id: `$${field}`,
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);

    return toCountMap(rows);
};

const getOverview = async () => {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(startOfToday);
    const day = startOfWeek.getDay();
    const daysFromMonday = (day + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
        totalReports,
        todayReports,
        weekReports,
        monthReports,
        voiceReports,
        textReports,
        highPriorityReports,
        categories,
        districts,
        states,
        languages,
        completedReports,
        pendingReports,
        failedReports,
        totalMedia,
    ] = await Promise.all([
        Report.countDocuments(),
        Report.countDocuments({ createdAt: { $gte: startOfToday } }),
        Report.countDocuments({ createdAt: { $gte: startOfWeek } }),
        Report.countDocuments({ createdAt: { $gte: startOfMonth } }),
        Report.countDocuments({ inputType: "voice" }),
        Report.countDocuments({ inputType: "text" }),
        Report.countDocuments({ urgency: { $in: ["high", "critical"] } }),
        Report.distinct("category"),
        Report.distinct("location.district"),
        Report.distinct("location.state"),
        Report.distinct("originalLanguage"),
        Report.countDocuments({ processingStatus: "completed" }),
        Report.countDocuments({ processingStatus: "pending" }),
        Report.countDocuments({ processingStatus: "failed" }),
        Media.countDocuments(),
    ]);

    return {
        totalReports,
        todayReports,
        weekReports,
        monthReports,
        voiceReports,
        textReports,
        highPriorityReports,
        categories: categories.length,
        districts: districts.length,
        states: states.length,
        languages: languages.length,
        processing: {
            completed: completedReports,
            pending: pendingReports,
            failed: failedReports,
        },
        totalMedia,
    };
};

const getTimeline = async (days = 30) => {
    const safeDays = Math.min(Math.max(Number(days) || 30, 7), 365);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (safeDays - 1));

    const rows = await Report.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate },
            },
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt",
                    },
                },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const counts = new Map(rows.map((row) => [row._id, row.count]));
    const timeline = [];

    for (let i = 0; i < safeDays; i += 1) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const key = date.toISOString().slice(0, 10);

        timeline.push({
            date: key,
            count: counts.get(key) || 0,
        });
    }

    return timeline;
};

const getHotspots = async () => {
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
                latitude: { $avg: "$location.latitude" },
                longitude: { $avg: "$location.longitude" },
            },
        },
        { $sort: { reportCount: -1, highPriorityReports: -1 } },
        { $limit: 50 },
    ]);

    return rows.map((row) => ({
        state: row._id.state || "Unknown",
        district: row._id.district || "Unknown",
        category: row._id.category || "Unknown",
        reportCount: row.reportCount,
        highPriorityReports: row.highPriorityReports,
        latitude: row.latitude ?? null,
        longitude: row.longitude ?? null,
    }));
};

const getRecommendations = async () => {
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

    return rows.map((row) => ({
        state: row._id.state || "Unknown",
        district: row._id.district || "Unknown",
        category: row._id.category || "Unknown",
        reportCount: row.reportCount,
        highPriorityReports: row.highPriorityReports,
        suggestedIntervention:
            interventionMap[row._id.category] || interventionMap.Other,
    }));
};

const getRecentReports = async (limit = 10) => {
    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 25);

    return Report.find(
        {},
        {
            originalText: 0,
            transcription: 0,
            englishText: 0,
            processingError: 0,
        }
    )
        .sort({ createdAt: -1 })
        .limit(safeLimit)
        .populate("submittedBy", "name")
        .lean();
};

const getStatistics = async (timelineDays = 30) => {
    const [
        overview,
        inputTypes,
        categories,
        subcategories,
        languages,
        urgency,
        processingStatus,
        states,
        districts,
        timeline,
        hotspots,
        recommendations,
        recentReports,
    ] = await Promise.all([
        getOverview(),
        groupCount("inputType"),
        groupCount("category"),
        groupCount("subcategory"),
        groupCount("originalLanguage"),
        groupCount("urgency"),
        groupCount("processingStatus"),
        groupCount("location.state"),
        groupCount("location.district"),
        getTimeline(timelineDays),
        getHotspots(),
        getRecommendations(),
        getRecentReports(),
    ]);

    return {
        overview,
        inputTypes,
        categories,
        subcategories,
        languages,
        urgency,
        processingStatus,
        states,
        districts,
        timeline,
        hotspots,
        recommendations,
        recentReports,
    };
};

module.exports = {
    getOverview,
    groupCount,
    getTimeline,
    getHotspots,
    getRecommendations,
    getRecentReports,
    getStatistics,
};
