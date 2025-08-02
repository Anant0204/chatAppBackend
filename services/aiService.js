import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `You are an expert in MERN and development. You have an experience of about 7-8 years. You always write a code in efficient way and easy to understand and you also follow best practice in development 
  You never miss the edge cases and always write code that is scalable and maintain easliy. You always handle error and expectations Your also make good comments and every developer understandable code. `,
});

export const generateResult = async (prompt) => {
  const result = await model.generateContent(prompt);

  return result.response.text();
};

// async function main() {
//   try {

//     const result = await model.generateContent("Explain how AI works in a few words");
//     const response = await result.response;
//     const text = response.text();
//     console.log("Gemini says:", text);
//   } catch (err) {
//     console.error("Gemini API Error:", err);
//   }
// }

// main();
