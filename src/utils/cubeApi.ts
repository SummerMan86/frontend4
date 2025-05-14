// src/utils/cubeApi.ts
import cube, { CubejsApi } from '@cubejs-client/core';

const CUBEJS_TOKEN = process.env.REACT_APP_CUBEJS_TOKEN;

if (!CUBEJS_TOKEN) {
  throw new Error('REACT_APP_CUBEJS_TOKEN is not defined');
}
const API_URL_BASE = process.env.REACT_APP_CUBEJS_API_URL;
if (!API_URL_BASE) {
  throw new Error('REACT_APP_CUBEJS_API_URL is not defined');
}

// Конструируем URL к API
const API_URL = `${API_URL_BASE}/cubejs-api/v1`;

// Экспорт типизированного клиента
const cubeApi: CubejsApi = cube(CUBEJS_TOKEN, { apiUrl: API_URL });
export default cubeApi;