import { Axios } from "../utils/mainContent";

const API = "/user";

export const userRegister = async (userData) => {
    const response = await Axios.post(`${API}/register`, userData);
    return response?.data;
};

export const userLogin = async (userData) => {
    const response = await Axios.post(`${API}/login`, userData);
    return response?.data;
};