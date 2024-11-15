import ort from "onnxruntime-node" ;
import fs from "fs" ;
import apiResponse from "../utils/apiResponse.js";

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

const predictor = asyncHandler ( async (req, res) => {
    const session = await ort.InferenceSession.create('../../ingredient_compatibility_model.onnx');

    const newIngredients = req.newIngredients ;

    const hashedVector = hashingVectorizer(newIngredients);

    // Define the input tensor
    const inputTensor = new ort.Tensor('float32', hashedVector, [1, 321]); // [1, 321] is the input shape

    // Run inference
    const feeds = { input: inputTensor }; // Replace 'input' with actual input name
    const results = await session.run(feeds);

    // Extract and print the prediction
    const prediction = results.output;

    console.log (prediction);

    return res
    .status(200)
    .json(
        new apiResponse(
            200,
            prediction,
            "Ingredient compatibility prediction"
        )
    )

})

export default predictor ;