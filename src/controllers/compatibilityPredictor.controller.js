import ort from "onnxruntime-node";
import path from "path";
import { fileURLToPath } from "url";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto"; // Correctly imported

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function hashingVectorizer(text, nFeatures = 321) {
    const vector = new Array(nFeatures).fill(0);
    const words = text.split(/\s+/);

    words.forEach(word => {
        const hash = crypto.createHash('md5').update(word).digest('hex');
        const index = parseInt(hash, 16) % nFeatures;
        vector[index] += 1;
    });

    return Float32Array.from(vector); // ONNX expects Float32Array for input
}

const predictor = asyncHandler(async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            console.log("hello hello")
            return res.status(400).json(
                new apiResponse(400, null, "Missing or invalid 'ingredients' in request")
            );
        }

        // Join ingredients into a single string for hashing
        const joinedIngredients = ingredients.join(" ");

        // Preprocess the input
        const hashedVector = hashingVectorizer(joinedIngredients);

        const modelPath = path.resolve(__dirname, '../../ingredient_compatibility_model.onnx');
        const session = await ort.InferenceSession.create(modelPath);

        // Define the input tensor
        const inputTensor = new ort.Tensor('float32', hashedVector, [1, 321]); // [1, 321] is the input shape

        // Run inference
        const feeds = { input: inputTensor }; // Replace 'input' with actual model input name
        const results = await session.run(feeds);

        // Extract and print the prediction
        const prediction = results; // Ensure 'output' matches your model's actual output key

        // console.log(prediction['label']['cpuData']);

        return res.status(200).json(
            new apiResponse(200, prediction['label']['cpuData'], "Ingredient compatibility prediction")
        );
    } catch (error) {
        console.error("Error during prediction:", error);
        return res.status(500).json(
            new apiResponse(500, null, "Failed to process prediction")
        );
    }
});

export default predictor;
