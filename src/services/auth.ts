
import axiosInstance from '../axiosInstance';

export const login = async (username: string, password: string) => {
    try {
        const response = await axiosInstance.post('/users/login', { username, password });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const register = async (username: string, email: string, password: string) => {
    try {
        const response = await axiosInstance.post('/users/register', { username, email, password });
        return response.data;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};