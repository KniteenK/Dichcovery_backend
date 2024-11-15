var axios = require('axios');

var config = {
  method: 'get',
maxBodyLength: Infinity,
  url: 'https://cosylab.iiitd.edu.in/api/foodPairingAnalysis/{{entity_id}}',
  headers: { }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
