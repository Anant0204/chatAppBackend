import * as ai from "../services/aiService.js";

export const getResult = async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt is required." });
    }

    const result = await ai.generateResult(prompt);
    res.status(200).send({ response: result }); // wrap in object for consistency
  } catch (error) {
    console.error("Gemini Error:", error.message);
    res.status(500).json({ message: "Gemini failed to generate a response." });
  }
};
