import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/generate", async (req, res) => {
  try {
    const { idea, genre = "Adventure", panels = 4 } = req.body ?? {};
    if (typeof idea !== "string" || idea.trim().length < 3) {
      return res.status(400).json({ error: "Please enter a story idea (at least 3 characters)." });
    }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is missing. Add it to your .env file and restart the server." });
    }

    const safePanels = Math.max(2, Math.min(8, Number(panels) || 4));
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Create a short, original comic story based on this idea: "${idea.trim()}".
Genre: ${genre}. Number of panels: ${safePanels}.
Return ONLY valid JSON with this exact shape:
{
  "title": "short comic title",
  "summary": "one-sentence summary",
  "panels": [
    {"number": 1, "scene": "visual scene description", "dialogue": "short speech or narration", "imagePrompt": "clear image prompt for an illustrator"}
  ]
}
Make exactly ${safePanels} panels. Keep dialogue concise and suitable for a general audience. Do not include markdown fences.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const raw = response.text || "";
    let story;
    try {
      story = JSON.parse(raw);
    } catch {
      throw new Error("Gemini returned an unexpected response. Please try again.");
    }
    if (!story.title || !Array.isArray(story.panels)) {
      throw new Error("The AI response was missing the expected comic details.");
    }
    res.json(story);
  } catch (error) {
    console.error("Comic generation error:", error);
    res.status(500).json({
      error: error?.message?.includes("API key") ? error.message : "Could not generate the comic. Check your API key, internet connection, and Gemini model access, then try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`ComicCraft is running at http://localhost:${PORT}`);
});