import axios from 'axios';

// 지금은 로컬 주소(예: localhost:8080)나 가짜 주소를 넣어두고, 나중에 그 주소로만 딱 바꾸면 돼요.
const API_BASE_URL = 'http://localhost:8080'; 

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});