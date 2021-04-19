const axios = require('axios');

const Api = axios.create({
  baseURL: "http://localhost:7766/api/"
});

export default Api;
