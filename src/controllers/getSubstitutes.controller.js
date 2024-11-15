import axios from "axios";
import apiResponse from "../utils/apiResponse.js";

const getSubstituteIngredient = async (req, res) => {
    const entity_id = req.entity_id; 
    console.log(entity_id);

    try {
        const response = await axios.get(`https://cosylab.iiitd.edu.in/api/foodPairingAnalysis/${entity_id}`);

        const fullData = response.data;
        const topSimilarEntities = fullData.similar_entities?.slice(0, 12) || []; 

        console.log(topSimilarEntities)

        const responseData = {
            entity_alias: fullData.entity_alias,
            top_similar_entities: topSimilarEntities,
        };

        return res.status(200).json(
            new apiResponse(
                200,
                responseData,
                `Top 3 similar entities for ${responseData.entity_alias}`
            )
        );
    } catch (error) {
        console.error("Error fetching substitute ingredients:", error);
        return res.status(500).send('Failed to fetch data');
    }
};

export default getSubstituteIngredient;
