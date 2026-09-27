const CivicDataset = require("../models/civicDataset_model");

const getDataset = async (_req, res, next) => {
    try {
        const dataset = await CivicDataset.findOne({ city: "Kolkata" })
            .sort({ createdAt: -1 })
            .lean();

        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: "Civic dataset has not been seeded yet. Run: npm run seed:dataset",
            });
        }

        res.json({
            success: true,
            dataset: {
                name: dataset.name,
                version: dataset.version,
                city: dataset.city,
                state: dataset.state,
                country: dataset.country,
                generatedAt: dataset.generatedAt,
                wards: dataset.wards,
                requests: dataset.requests,
                infrastructure: dataset.infrastructure,
                investments: dataset.investments,
                clusters: dataset.clusters,
                projects: dataset.projects,
                trends: dataset.trends,
            },
        });
    } catch (error) {
        next(error);
    }
};

const getWards = async (_req, res, next) => {
    try {
        const dataset = await CivicDataset.findOne({ city: "Kolkata" })
            .select("wards")
            .lean();

        if (!dataset) {
            return res.status(404).json({
                success: false,
                message: "Civic dataset has not been seeded yet.",
            });
        }

        res.json({ success: true, wards: dataset.wards });
    } catch (error) {
        next(error);
    }
};

module.exports = { getDataset, getWards };
