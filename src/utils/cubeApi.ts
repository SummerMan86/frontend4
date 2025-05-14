// src/utils/cubeApi.ts
import cube  from '@cubejs-client/core';

const CUBEJS_TOKEN = process.env.REACT_APP_CUBEJS_TOKEN;

if (!CUBEJS_TOKEN) {
  throw new Error('REACT_APP_CUBEJS_TOKEN is not defined');
}
const API_URL = process.env.REACT_APP_CUBEJS_API_URL;
if (!API_URL) {
  throw new Error('REACT_APP_CUBEJS_API_URL is not defined');
}
console.log("API_URL:", API_URL);

// Экспорт типизированного клиента
const cubeApi = cube(CUBEJS_TOKEN, { apiUrl: API_URL });
export default cubeApi;