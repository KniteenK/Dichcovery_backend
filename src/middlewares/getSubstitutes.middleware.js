import axios from "axios";
const getSubstituteIngredient = (req, res, next) => {
    const { entity_id } = req.entity_id; 

    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://cosylab.iiitd.edu.in/api/foodPairingAnalysis/{{entity_id}}`,
        headers: {}
    };

    axios(config)
        .then(function (response) {
            req.entityData = response.data;
            req.query = `Suggest healthier ingredients for ${response.data.entity_alias} from ${response.data}`
            next();
        })
        .catch(function (error) {
            console.error(error);
            res.status(500).send('Failed to fetch data');
        });
};

export default getSubstituteIngredient;
