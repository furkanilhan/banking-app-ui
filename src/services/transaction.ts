import axiosInstance from '../axiosInstance';

export const initiateTransfer = async (transactionData: {
    fromAccountNumber: string;
    toAccountNumber: string;
    amount: number;
}) => {
    try {
        const response = await axiosInstance.post(
            '/transactions/transfer',
            transactionData,
        );
        return response.data;
    } catch (error) {
        console.error('Error initiating transfer:', error);
        throw error;
    }
};

export const fetchTransactionHistory = async (
    accountId: string,
    page: number,
) => {
    try {
        const response = await axiosInstance.get(
            `/transactions/account/${accountId}`,
            {
                params: { page },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        throw error;
    }
};
