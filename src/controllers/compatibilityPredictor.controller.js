import ort from "onnxruntime-node";
import path from "path";
import { fileURLToPath } from "url";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto"; // Add missing import for crypto

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
        const modelPath = path.resolve(__dirname, '../../ingredient_compatibility_model.onnx');
        const session = await ort.InferenceSession.create(modelPath);

        let newIngredients = req.body.newIngredients; 

        console.log(newIngredients)
        
        newIngredients = new onnxruntimeBackend.Tensor(newIngredients, 'string', 3) ;
        
        console.log(newIngredients)
        if (!newIngredients) {
            return res.status(400).json(
                new apiResponse(400, null, "Missing newIngredients in request")
            );
        }

        const hashedVector = hashingVectorizer(newIngredients);

        // Define the input tensor
        const inputTensor = new ort.Tensor('float32', hashedVector, [1, 321]); // [1, 321] is the input shape

        // Run inference
        const feeds = { input: inputTensor }; // Replace 'input' with actual model input name
        const results = await session.run(feeds);

        // Extract and print the prediction
        const prediction = results.output; // Ensure 'output' matches your model's actual output key

        console.log(prediction);

        return res.status(200).json(
            new apiResponse(200, prediction, "Ingredient compatibility prediction")
        );
    } catch (error) {
        console.error("Error during prediction:", error);
        return res.status(500).json(
            new apiResponse(500, null, "Failed to process prediction")
        );
    }
});

export default predictor;
