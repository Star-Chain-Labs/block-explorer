import { Axios } from "../utils/mainContent";

const API = "/user";
const CBM_API = "/admin";
export const userRegister = async (userData) => {
    const response = await Axios.post(`${API}/register`, userData);
    return response?.data;
};

export const userLogin = async (userData) => {
    const response = await Axios.post(`${API}/login`, userData);
    return response?.data;
};

export const getCbmNewPeice = async () => {
    const response = await Axios.get(`${CBM_API}/get-cbmprice`);
    return response?.data;
}
