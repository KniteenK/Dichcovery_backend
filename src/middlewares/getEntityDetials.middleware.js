import axios from "axios";

const getEntityDetails = async (req, res, next) => {
    try {
        const { category_name, entity_name } = req.query;

        var config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://cosylab.iiitd.edu.in/api/entity/getentities?category=${category_name}&name=${entity_name}`,
            headers: {}
        };

        const response = await axios(config);
        req.entityData = response.data; 
        next(); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to fetch data'); // Send error response
    }
};

export default getEntityDetails ;