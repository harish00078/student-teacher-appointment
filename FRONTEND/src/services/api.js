import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5001/api"
  baseURL: "https://student-teacher-appointment-backend-t5qq.onrender.com/api"
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;