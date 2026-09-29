const {
    getOverview,
    groupCount,
    getTimeline,
    getHotspots,
    getRecommendations,
    getRecentReports,
    getStatistics,
} = require("../services/dashboardService");

const overview = async (_req, res, next) => {
    try {
        const data = await getOverview();

        res.json({
            success: true,
            overview: data,
        });
    } catch (error) {
        next(error);
    }
};

const groupedData = (field, responseKey = "data") => async (_req, res, next) => {
    try {
        const data = await groupCount(field);

        res.json({
            success: true,
            [responseKey]: data,
        });
    } catch (error) {
        next(error);
    }
};

const categories = groupedData("category");
const languages = groupedData("originalLanguage");
const urgency = groupedData("urgency");
const inputTypes = groupedData("inputType");
const subcategories = groupedData("subcategory");
const states = groupedData("location.state");
const districts = groupedData("location.district");
const processingStatus = groupedData("processingStatus");

const timeline = async (req, res, next) => {
    try {
        const data = await getTimeline(req.query.days);

        res.json({
            success: true,
            timeline: data,
        });
    } catch (error) {
        next(error);
    }
};

const hotspots = async (_req, res, next) => {
    try {
        const data = await getHotspots();

        res.json({
            success: true,
            hotspots: data,
        });
    } catch (error) {
        next(error);
    }
};

const recommendations = async (_req, res, next) => {
    try {
        const data = await getRecommendations();

        res.json({
            success: true,
            note: "These are data-driven system suggestions, not official government decisions.",
            recommendations: data,
        });
    } catch (error) {
        next(error);
    }
};

const recentReports = async (req, res, next) => {
    try {
        const data = await getRecentReports(req.query.limit);

        res.json({
            success: true,
            reports: data,
        });
    } catch (error) {
        next(error);
    }
};

const statistics = async (req, res, next) => {
    try {
        const data = await getStatistics(req.query.days);

        res.json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    overview,
    categories,
    languages,
    urgency,
    inputTypes,
    subcategories,
    states,
    districts,
    processingStatus,
    timeline,
    hotspots,
    recommendations,
    recentReports,
    statistics,
};
