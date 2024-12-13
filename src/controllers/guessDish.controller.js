import fs from "fs";
import path from "path";
import ort from "onnxruntime-node";
import {Jimp} from "jimp";
import apiResponse from "../utils/apiResponse.js";

const preprocessImage = async (imagePath) => {
  try {
      const image = await Jimp.read(imagePath);

      // Resize the image to 224x224
      image.resize(224, 224);

      // Normalize pixel values to [0, 1]
      const normalizedData = [];
      for (let y = 0; y < 224; y++) {
          for (let x = 0; x < 224; x++) {
              const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y)); // Get pixel color
              normalizedData.push(r / 255, g / 255, b / 255); // Normalize each channel
          }
      }

      // Create a Float32Array from the normalized data
      const floatArray = Float32Array.from(normalizedData);

      // Create an ONNX tensor with shape [1, 3, 224, 224]
      return new ort.Tensor("float32", floatArray, [1, 3, 224, 224]);
  } catch (error) {
      console.error("Error preprocessing image:", error.message);
      throw error;
  }
};

const runModel = async (req, res) => {
  const imagePath = req.file.path; // Path of the uploaded image
  const modelPath = path.resolve("../../mobilenetv2.onnx");

  try {
      // Preprocess the image
      const inputTensor = await preprocessImage(imagePath);

      // Load the ONNX model
      const session = await ort.InferenceSession.create(modelPath);

      // Check the input name and shape to ensure compatibility
      const inputName = session.inputNames[0];  // Retrieve the model input name dynamically
      console.log("Model input name:", inputName);  // Log the input name for debugging

      // Run the model
      const feeds = { [inputName]: inputTensor }; // Dynamically use the correct input name
      const results = await session.run(feeds);

      // Get the output tensor
      const output = results.dense_2; // Assuming 'dense_2' is the output name
      console.log("Predictions:", output.data);

      // Find the class index with the highest probability
      const predictedClassIndex = output.data.indexOf(Math.max(...output.data));
      console.log("Predicted Class Index:", predictedClassIndex);

      // Example: Modify the image and send it back
      const processedImage = await Jimp.read(imagePath);
      processedImage.greyscale(); // Example operation: Convert to greyscale
      const processedImagePath = path.join(path.dirname(imagePath), "processed-" + path.basename(imagePath));
      await processedImage.writeAsync(processedImagePath);

      // Send the processed image as a response
      res.sendFile(processedImagePath, (err) => {
          if (err) {
              console.error("Error sending file:", err.message);
          }

          // Delete both original and processed images from the server
          fs.unlink(imagePath, (unlinkErr) => {
              if (unlinkErr) console.error("Error deleting original image:", unlinkErr);
          });

          fs.unlink(processedImagePath, (unlinkErr) => {
              if (unlinkErr) console.error("Error deleting processed image:", unlinkErr);
          });
      });
  } catch (error) {
      console.error("Error running model:", error.message);
      return res.status(500).json(new apiResponse(500, null, "Internal server error"));
  }
};

export default runModel;