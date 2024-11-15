var axios = require('axios');

const fetchDataMiddleware = (req, res, next) => {
    const { category_name, entity_name } = req.query; // or req.body, depending on how you're sending data

    var config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://cosylab.iiitd.edu.in/api/entity/getentities?category=${category_name}&name=${entity_name}`,
        headers: {}
    };

    axios(config)
        .then(function (response) {
            req.entityData = response.data; // Attach the response data to the req object
            next(); // Call next to proceed to the next middleware or route handler
        })
        .catch(function (error) {
            console.error(error);
            res.status(500).send('Failed to fetch data'); // Handle error
        });
};

export default fetchDataMiddleware ;