const mongoose = require("mongoose");

const civicDatasetSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        version: { type: String, required: true },
        city: { type: String, required: true, index: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        generatedAt: { type: Date, required: true },
        wards: { type: [mongoose.Schema.Types.Mixed], default: [] },
        requests: { type: [mongoose.Schema.Types.Mixed], default: [] },
        infrastructure: { type: [mongoose.Schema.Types.Mixed], default: [] },
        investments: { type: [mongoose.Schema.Types.Mixed], default: [] },
        clusters: { type: [mongoose.Schema.Types.Mixed], default: [] },
        projects: { type: [mongoose.Schema.Types.Mixed], default: [] },
        trends: { type: [mongoose.Schema.Types.Mixed], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CivicDataset", civicDatasetSchema);
