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
  // base: "http://192.168.1.3:6071/api",
  // origin: "http://192.168.1.3:6071",

  base: "https://api.cbm.robomine.live/api",
  origin: "https://api.cbm.robomine.live",
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
