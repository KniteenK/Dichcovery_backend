import fs from "fs";
import path from "path";
import ort from "onnxruntime-node";
import {Jimp} from "jimp";
import sharp from "sharp";
import apiResponse from "../utils/apiResponse.js";

const preprocessImage = async (imagePath) => {
    try {
        // Resize the image to 224x224 and normalize pixel values to [0, 1]
        const imageBuffer = await sharp(imagePath)
            .resize(224, 224)
            .toBuffer();

        const image = await sharp(imageBuffer).raw().toBuffer();
        const normalizedData = [];

        for (let i = 0; i < image.length; i += 3) {
            const r = image[i] / 255;
            const g = image[i + 1] / 255;
            const b = image[i + 2] / 255;
            normalizedData.push(r, g, b);
        }

        const floatArray = Float32Array.from(normalizedData);

        // Create an ONNX tensor with shape [1, 3, 224, 224]
        return new ort.Tensor("float32", floatArray, [1, 224, 224, 3]);
    } catch (error) {
        console.error("Error preprocessing image:", error.message);
        throw error;
    }
};

const runModel = async (req, res) => {
  const imagePath = req.file.path; // Path of the uploaded image
  const modelPath = path.resolve("mobilenetv2.onnx");

  const classMapping = [
    'adhirasam', 'aloo_gobi', 'aloo_matar', 'aloo_methi', 'aloo_shimla_mirch', 'aloo_tikki', 'anarsa', 'ariselu', 'bandar_laddu', 'basundi',
    'bhatura', 'bhindi_masala', 'biryani', 'boondi', 'butter_chicken', 'chak_hao_kheer', 'cham_cham', 'chana_masala', 'chapati', 'chhena_kheeri',
    'chicken_razala', 'chicken_tikka', 'chicken_tikka_masala', 'chikki', 'daal_baati_churma', 'daal_puri', 'dal_makhani', 'dal_tadka', 'dharwad_pedha',
    'doodhpak', 'double_ka_meetha', 'dum_aloo', 'gajar_ka_halwa', 'gavvalu', 'ghevar', 'gulab_jamun', 'imarti', 'jalebi', 'kachori', 'kadai_paneer',
    'kadhi_pakoda', 'kajjikaya', 'kakinada_khaja', 'kalakand', 'karela_bharta', 'kofta', 'kuzhi_paniyaram', 'lassi', 'ledikeni', 'litti_chokha',
    'lyangcha', 'maach_jhol', 'makki_di_roti_sarson_da_saag', 'malapua', 'misi_roti', 'misti_doi', 'modak', 'mysore_pak', 'naan', 'navrattan_korma',
    'palak_paneer', 'paneer_butter_masala', 'phirni', 'pithe', 'poha', 'poornalu', 'pootharekulu', 'qubani_ka_meetha', 'rabri', 'ras_malai',
    'rasgulla', 'sandesh', 'shankarpali', 'sheer_korma', 'sheera', 'shrikhand', 'sohan_halwa', 'sohan_papdi', 'sutar_feni', 'unni_appam'
  ];
  

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
      console.log("Predicted Class Index:", classMapping[predictedClassIndex]);

      return res.status(200)
      .json(
        new apiResponse(200, { class: classMapping[predictedClassIndex] }, "Ingredient prediction")
      )
     
  } catch (error) {
      console.error("Error running model:", error.message);
      const output = {
        class: classMapping[predictedClassIndex]
      }
      return res.status(210).json(new apiResponse(210, output, "Internal server error"));
  }
};

export default runModel;