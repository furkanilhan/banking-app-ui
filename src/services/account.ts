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