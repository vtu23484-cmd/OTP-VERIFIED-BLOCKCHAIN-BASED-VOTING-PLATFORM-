import axios from 'axios';

// This connects your frontend to your backend
const api = axios.create({
    baseURL: 'http://localhost:4000/api',
});

export default api;
