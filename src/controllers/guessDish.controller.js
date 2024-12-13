// Import required modules
import ort from "onnxruntime-node";
import {Jimp} from "jimp";
import apiResponse from "../utils/apiResponse.js";

// Define the ONNX controller

  const preprocessImage = async (imagePath) => {
    try {
      const image = await Jimp.read(imagePath);

      // Resize the image to 224x224
      image.resize(224, 224);

      // Normalize pixel values to [0, 1]
      const normalizedData = [];
      for (let y = 0; y < 224; y++) {
        for (let x = 0; x < 224; x++) {
          const { r, g, b } = jimp.intToRGBA(image.getPixelColor(x, y)); // Get pixel color
          normalizedData.push(r / 255, g / 255, b / 255); // Normalize each channel
        }
      }

      // Create a Float32Array from the normalized data
      const floatArray = Float32Array.from(normalizedData);

      // Create an ONNX tensor with shape [1, 3, 224, 224]
      return new ort.Tensor("float32", floatArray, [1, 3, 224, 224]);
    } catch (error) {
      console.error("Error preprocessing image:", error);
      throw error;
    }
};

const runModel = async (req, res) => {
    try {
      // Preprocess the image
      const imagePath = "../../public/temp/"
      const modelPath = "../../mobilenetv2.onnx"
      const inputTensor = await preprocessImage(imagePath);

      // Load the ONNX model
      const session = await ort.InferenceSession.create(modelPath);

      // Run the model
      const feeds = { input: inputTensor }; // Adjust 'input' to match your model's input name
      const results = await session.run(feeds);

      // Get the output tensor
      const output = results.output; // Adjust 'output' to match your model's output name
      console.log("Predictions:", output.data);

      // Find the class index with the highest probability
      const predictedClassIndex = output.data.indexOf(Math.max(...output.data));
      console.log("Predicted Class Index:", predictedClassIndex);

      const finalOutput = {
        predictions: output.data,
        predictedClassIndex,
      }

      return res.status(200).json(
        new apiResponse(200, finalOutput, "success")
      ) 
    } catch (error) {
      console.error("Error running model:", error);
      throw error;
    }
  }

// Export the controller
export default runModel;
