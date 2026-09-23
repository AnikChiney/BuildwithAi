const getClient = async () => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const { GoogleGenAI } = await import("@google/genai");
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

const CATEGORIES = [
    "Roads",
    "Healthcare",
    "Education",
    "Water",
    "Sanitation",
    "Electricity",
    "Public Transport",
    "Housing",
    "Agriculture",
    "Employment",
    "Digital Connectivity",
    "Other",
];

const reportSchema = {
    type: "object",
    properties: {
        originalLanguage: {
            type: "string",
            description: "ISO 639-1 language code where possible, e.g. en, bn, hi.",
        },
        englishText: {
            type: "string",
            description: "Accurate English translation. Do not add facts.",
        },
        category: {
            type: "string",
            enum: CATEGORIES,
        },
        subcategory: {
            type: "string",
        },
        summary: {
            type: "string",
        },
        urgency: {
            type: "string",
            enum: ["low", "medium", "high", "critical"],
        },
        keywords: {
            type: "array",
            items: { type: "string" },
        },
    },
    required: [
        "originalLanguage",
        "englishText",
        "category",
        "subcategory",
        "summary",
        "urgency",
        "keywords",
    ],
};

const analyzeReport = async (text) => {
    const ai = await getClient();

    const prompt = `You are processing a citizen development request for a public-service planning system.

Return ONLY the requested structured JSON.
Rules:
- Detect the language of the input.
- Translate the input accurately into English.
- Do not invent facts, locations, causes, numbers, or identities.
- Classify into exactly one allowed category.
- Use "Other" if no category fits.
- urgency must reflect the issue described, not assumptions.
- summary must be concise and factual.
- keywords should contain 2-8 useful terms.

Allowed categories: ${CATEGORIES.join(", ")}

Citizen input:
${text}`;

    const response = await ai.models.generateContent({
        model: process.env.GEMINI_TEXT_MODEL || "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: reportSchema,
            temperature: 0.1,
        },
    });

    if (!response.text) {
        throw new Error("AI returned an empty response");
    }

    return JSON.parse(response.text);
};

module.exports = { analyzeReport, CATEGORIES };
