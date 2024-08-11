import axiosInstance from '../axiosInstance';

export const fetchAccounts = async (page: number, name?: string, number?: string) => {
    try {
        const response = await axiosInstance.post('/accounts/search', {},{
            params: {
                page,
                name,
                number,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching accounts:', error);
        throw error;
    }
};

export const fetchAccountById = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/accounts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching account details:', error);
        throw error;
    }
};

export const createAccount = async (name: string, initialBalance: number) => {
    try {
        const response = await axiosInstance.post('/accounts', {}, {
            params: {
            name,
            initialBalance
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating account:', error);
        throw error;
    }
};

export const updateAccount = async (id: string, name: string, balance: number) => {
    try {
        const response = await axiosInstance.put(`/accounts/${id}`, {}, {
            params: {
            name,
            balance
        }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating account:', error);
        throw error;
    }
};

export const deleteAccount = async (id: string) => {
    try {
        const response = await axiosInstance.delete(`/accounts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting account:', error);
        throw error;
    }
};