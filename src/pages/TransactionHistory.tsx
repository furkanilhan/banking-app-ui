import React, { useEffect, useState } from 'react';
import { List, Card, Pagination, message } from 'antd';
import { fetchTransactionHistory } from '../services/transaction';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface Transaction {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    date: string;
}

interface TransactionHistoryProps {
    accountId?: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ accountId: propAccountId }) => {
    const { accountId: routeAccountId } = useParams<{ accountId: string }>();
    const accountId = propAccountId || routeAccountId;
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const loadTransactionHistory = async () => {
            if (!accountId) return;
            setLoading(true);
            try {
                const data = await fetchTransactionHistory(accountId, currentPage - 1);
                setTransactions(data.content);
                setTotalTransactions(data.totalElements);
            } catch (error) {
                message.error('Failed to load transaction history.');
            }
            setLoading(false);
        };

        loadTransactionHistory();
    }, [accountId, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (!accountId) {
        return <p>Account ID is missing.</p>;
    }

    return (
        <div>
            <List
                loading={loading}
                dataSource={transactions}
                renderItem={(transaction) => {
                    const isIncoming = transaction.toAccountId === accountId;
                    const amountStyle = {
                        color: isIncoming ? 'green' : 'red',
                        fontWeight: 'bold',
                    };
                    const amountSign = isIncoming ? '+' : '-';
                    const transactionType = isIncoming ? 'Credit' : 'Debit';
                    const transactionTypeStyle = {
                        color: isIncoming ? 'green' : 'red',
                        display: 'flex',
                        alignItems: 'center',
                    };
                    const transactionIcon = isIncoming ? <ArrowDownOutlined /> : <ArrowUpOutlined />;

                    return (
                        <List.Item key={transaction.id}>
                            <Card title={`Transaction ${transaction.id}`}>
                                <div style={transactionTypeStyle}>
                                    {transactionIcon}
                                    <span style={{ marginLeft: 8 }}>{transactionType}</span>
                                </div>
                                <p>From Account: {transaction.fromAccountId}</p>
                                <p>To Account: {transaction.toAccountId}</p>
                                <p>
                                    Amount: <span style={amountStyle}>{amountSign} {transaction.amount} USD</span>
                                </p>
                                <p>Date: {moment(transaction.date).format('YYYY-MM-DD HH:mm:ss')}</p>
                            </Card>
                        </List.Item>
                    );
                }}
            />
            <Pagination
                current={currentPage}
                pageSize={5}
                total={totalTransactions}
                onChange={handlePageChange}
                style={{ marginTop: 16 }}
            />
        </div>
    );
};
