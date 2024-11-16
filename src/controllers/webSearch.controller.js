import Groq from "groq-sdk";
import asyncHandler from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { configDotenv } from "dotenv";

configDotenv()

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const webResults = asyncHandler( async (req, res) => {
    const {query} = req.body;
    console.log(query)
    try {
        const finalResult = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: query,
                },
            ],
            model: "llama3-8b-8192",
        });

        return res.status(200).json(new apiResponse(200, finalResult.choices[0]?.message?.content, "Fetched results"));
    } catch (error) {
        throw new apiError("Groq API error: ", error);
    }
})

export default webResults;