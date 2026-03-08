// src/services/api.js
import axios from 'axios';

// ตั้งค่า URL กลางของ Backend (Spring Boot รันพอร์ต 8080)
const API_URL = 'http://localhost:8080/api/v1'; 

// สร้าง Instance ของ Axios
const api = axios.create({
    baseURL: API_URL,
});

// พิเศษสำหรับการทำ CORS: ยามหน้าตึกต้องขอตรวจบัตรทุกครั้ง
// เราจะแอบใส่ Token เข้าไปใน Header อัตโนมัติถ้ามี!
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;