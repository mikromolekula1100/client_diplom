import axios from "axios";


export const API_URL = "http://localhost:8080/";

const authApi = axios.create({
    withCredentials: false,
    baseURL: API_URL,
  });

authApi.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    config.headers["Content-Type"] = "application/json";
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE";
    config.headers["Access-Control-Allow-Headers"] = "Content-Type";
    return config;
  });

  export default authApi;