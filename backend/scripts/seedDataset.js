require("dotenv").config();

const connectDatabase = require("./src/config/database");
const CivicDataset = require("./src/models/civicDataset_model");
const dataset = require("./src/seed/civicDataset.json");

const seed = async () => {
    await connectDatabase();

    await CivicDataset.deleteMany({ city: dataset.city });
    await CivicDataset.create(dataset);

    console.log(
        `CivicSignal dataset seeded: ${dataset.wards.length} wards, ${dataset.requests.length} requests, ${dataset.infrastructure.length} infrastructure profiles, ${dataset.investments.length} investment records, ${dataset.projects.length} projects.`
    );

    process.exit(0);
};

seed().catch((error) => {
    console.error("Dataset seed failed:", error);
    process.exit(1);
});
