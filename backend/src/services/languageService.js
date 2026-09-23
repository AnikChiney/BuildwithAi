const { analyzeReport } = require("./aiService");

const processText = async (text) => {
    if (!text || !String(text).trim()) {
        throw new Error("Report text is required");
    }

    const result = await analyzeReport(String(text).trim());

    return {
        originalLanguage: result.originalLanguage,
        englishText: result.englishText,
        category: result.category,
        subcategory: result.subcategory,
        summary: result.summary,
        urgency: result.urgency,
        keywords: Array.isArray(result.keywords) ? result.keywords : [],
    };
};

module.exports = { processText };
