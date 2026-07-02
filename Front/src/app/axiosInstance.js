import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:4002",
});

let getToken = () => null;
export const setTokenGetter = (fn) => {
    getToken = fn;
};

axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;