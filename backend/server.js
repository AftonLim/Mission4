require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System prompt for your insurance chatbot
const systemPrompt = `
You are Tina, an AI insurance consultant. You help users choose the right insurance policy by asking appropriate questions and then making a final recommendation.
Only ask questions after the user agrees to be interviewed.

You are allowed to ask any helpful personal questions, except for directly inquiring about the product they want.

Available Products:
1. Mechanical Breakdown Insurance (MBI) - not available for trucks or racing cars.
2. Comprehensive Car Insurance - only for vehicles less than 10 years old.
3. Third Party Car Insurance - available to everyone.

At the end, recommend the best insurance policy based on the user's answers and explain why.
`;

// Keep chat history per session (for simplicity, global here)
let chatHistory = [];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Add user message to chat history
    chatHistory.push({ role: "user", content: userMessage });

    const contents = [
        systemPrompt,
        ...chatHistory.map(msg => `${msg.role}: ${msg.content}`)
    ];

    // Call generateContent on chats.modelsModule with prompt
    const response = await ai.chats.modelsModule.generateContent({
      model: process.env.GEMINI_MODEL_NAME || "gemini-2.0-flash",
      contents,
      ...chatHistory,
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 1.0,
    });

    console.log("AI raw response:", response);

    if (!response || !response.candidates || response.candidates.length === 0) {
      return res.status(500).json({ error: "No response from AI" });
    }

    // Extract the AI's response text using the correct response structure
    const aiResponse = response.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    // Add AI response to chat history
    chatHistory.push({ role: "assistant", content: aiResponse });

    res.json({ response: aiResponse });
    
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
