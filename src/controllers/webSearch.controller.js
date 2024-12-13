import dotenv from "dotenv";
import OpenAI from "openai";
import asyncHandler from "../utils/asyncHandler.js";
// import express from "express";
// import cors from "cors";

dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors()); // Enable CORS

const apikey = process.env.XAI_API_KEY;
const openai = new OpenAI({
  apiKey: apikey,
  baseURL: 'https://api.x.ai/v1',
});

const webResults = asyncHandler(async (req, res) => {
  try {
    const { messages } = req.body; // Get messages from request body

    const response = await openai.chat.completions.create({
      model: "grok-beta",
      messages: messages,
      max_tokens: 200,
      headers: {
        Authorization: `Bearer ${apikey}`,
      },
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default webResults;







// import Groq from "groq-sdk";
// import asyncHandler from "../utils/asyncHandler.js";
// import { apiError } from "../utils/apiError.js";
// import apiResponse from "../utils/apiResponse.js";
// import { configDotenv } from "dotenv";

// configDotenv()

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


// const webResults = asyncHandler( async (req, res) => {
//     const {query} = req.body;
//     console.log(query)
//     try {
//         const finalResult = await groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "user",
//                     content: query,
//                 },
//             ],
//             model: "llama3-8b-8192",
//         });
//         return res.status(200).json(new apiResponse(200, finalResult.choices[0]?.message?.content, "Fetched results"));
//     } catch (error) {
//         throw new apiError("Groq API error: ", error);
//     }
// })

// export default webResults;