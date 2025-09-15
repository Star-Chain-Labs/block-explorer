import axios from "axios";

export const MainContent = {
    appName: "CBM Block Explorer",
    appURL: "",
    contactNo: "+0123456789",
    email: "blockexplorer@example.com",
    address: "",
    telegram_link: "https://t.me/YourTelegramUsername",
};

export const backendConfig = {
    base: "http://192.168.1.15:3001/api",
    origin: "http://192.168.1.15:3001",

    // base: "https://api.p5.starchainlabs.in/api",
    // origin: "https://api.p5.starchainlabs.in",
};


export const Axios = axios.create({
    baseURL: backendConfig.base,
    withCredentials: true,
});
Axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); // get token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

