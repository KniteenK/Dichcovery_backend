import axios from "axios";

const getEntityDetails = async (req, res, next) => {
    try {

        const {ingredient} = req.body;

        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://cosylab.iiitd.edu.in/api/entity/getentities?name=${ingredient}`,
            headers: {
                'Content-Type': 'application/json',
                'x-API-key': process.env.X_API_KEY
            }
        };

        const response = await axios(config);
        // console.log(response)
        req.entity_id = response.data[0]['entity_id']; 
        console.log(req.entity_id) ;
        next(); 
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Failed to fetch data'); // Send error response
    }
};

export default getEntityDetails ;