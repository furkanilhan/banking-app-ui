import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { useParams } from 'react-router-dom';
import { fetchAccountById } from '../services/account';

interface Account {
    id: string;
    name: string;
    number: string;
    balance: number;
}

export const AccountDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadAccount = async () => {
            setLoading(true);
            try {
                const data = await fetchAccountById(id!);
                setAccount(data);
            } catch (error) {
                console.error('Failed to load account details:', error);
            }
            setLoading(false);
        };

        loadAccount();
    }, [id]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : account ? (
                <Card title={account.name}>
                    <p>Account Number: {account.number}</p>
                    <p>Balance: {account.balance} USD</p>
                </Card>
            ) : (
                <p>Account not found.</p>
            )}
        </div>
    );
};
