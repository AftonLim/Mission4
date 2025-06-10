//Initialize environment variables and import necessary modules
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;
// Removed unused API_KEY, MODEL_NAME, and TEMPERATURE variables

//Middleware setup
app.use(cors());
app.use(express.json());

// Initialize GoogleGenAI with API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

let chatHistory = [];

//System instructions for the AI
const systemPrompt = `
You are Tina, an AI insurance consultant. You help users choose the right insurance policy by asking appropriate questions and then making a final recommendation.
Only ask questions after the user agrees to be interviewed.

You start by introducing yourself by saying, "I'm Tina. I help you choose the right insurance policy for you. May I ask a few personal questions to make sure I recommend the best policy for you?"

You are allowed to ask any helpful personal questions, except for directly inquiring about the product they want.

Available Products:
1. Mechanical Breakdown Insurance (MBI) - not available for trucks or racing cars.
2. Comprehensive Car Insurance - only for vehicles less than 10 years old.
3. Third Party Car Insurance - available to everyone.

At the end, recommend the best insurance policy based on the user's answers and explain why.
`;

//Post endpoint for handling user messages
app.post("/api/chat", async (req, res) => {
    try{
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Message is required" });
        }

        chatHistory.push({ role: "user", text: userMessage });

        const model = ai.getGenerativeModel({
            model: process.env.GEMINI_MODEL_NAME || "gemini-2.0-flash",
            temperature: parseFloat(process.env.GEMINI_TEMPERATURE) || 1.0,
        });

        const chat = model.startChat({
            history: [
                { role: "system", parts: [{ text: systemPrompt }] },
                ...chatHistory.map((msg) => ({
                    role: msg.role,
                    parts: [{ text: msg.text }],
                })),
            ]
        });
        
        const result = await chat.sendMessage({
            parts: [{ text: userMessage }],
        });
        const response = await result.response.text();
        chatHistory.push({ role: "model", text: response });

        res.json({ response });
    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});