import axiosInstance from './axiosConfig';

export const login = (data) => axiosInstance.post('api/auth/login', data);
export const register = (data) => axiosInstance.post('api/auth/register', data);
export const changePassword = (data) => axiosInstance.post('api/auth/login/change-password', data);
