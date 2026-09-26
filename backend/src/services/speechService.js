const fs = require("fs/promises");

const transcribeAudio = async (filePath, mimeType) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const { GoogleGenAI } = await import("@google/genai");

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const uploaded = await ai.files.upload({
        file: filePath,
        config: { mimeType },
    });

    try {
        if (!uploaded?.name || !uploaded?.uri) {
            throw new Error("Gemini audio upload failed");
        }

        console.log("Gemini audio uploaded:", {
            name: uploaded.name,
            uri: uploaded.uri,
            mimeType: uploaded.mimeType,
        });

        const response = await ai.models.generateContent({
            model:
                process.env.GEMINI_TRANSCRIBE_MODEL ||
                "gemini-3.5-transcribe",

            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            fileData: {
                                fileUri: uploaded.uri,
                                mimeType: uploaded.mimeType || mimeType,
                            },
                        },
                        {
                            text: "Transcribe this audio exactly. Return only the spoken transcription.",
                        },
                    ],
                },
            ],
        });

        // Debug: inspect the actual response structure
        console.dir(response.candidates?.[0]?.content?.parts, {
            depth: null,
        });

        const parts =
            response.candidates?.[0]?.content?.parts || [];

        let transcription = "";

        for (const part of parts) {
            // Normal text response
            if (part.text) {
                transcription += part.text;
            }

            // Audio transcription response
            if (part.audioTranscription) {
                if (typeof part.audioTranscription === "string") {
                    transcription += part.audioTranscription;
                } else if (part.audioTranscription.text) {
                    transcription += part.audioTranscription.text;
                }
            }
        }

        transcription = transcription.trim();

        if (!transcription) {
            throw new Error(
                "Speech-to-text returned an empty transcription"
            );
        }

        console.log("Transcription:", transcription);

        return transcription;
    } finally {
        try {
            if (uploaded?.name) {
                await ai.files.delete({
                    name: uploaded.name,
                });
            }
        } catch (cleanupError) {
            console.warn(
                "Gemini file cleanup failed:",
                cleanupError.message
            );
        }

        await fs.unlink(filePath).catch(() => {});
    }
};

module.exports = { transcribeAudio };