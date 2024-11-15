import axios from "axios";

const getEntityDetails = async (req, res, next) => {
    try {
        const {ingredient } = req.body;

        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://cosylab.iiitd.edu.in/api/entity/getentities?name=${ingredient}`,
            headers: {}
        };

        const response = await axios(config);
        req.entity_id = response.data[0]['entity_id']; 
        console.log(req.entity_id) ;
        next(); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch data'); // Send error response
    }
};

export default getEntityDetails ;