import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { List, Card, message } from 'antd';
import { fetchTransactionHistory } from '../services/transaction';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PaginationComponent } from '../components/PaginationComponent/PaginationComponent';
import { AppState } from '../store/store';
import './TransactionHistory.scss';

interface Transaction {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    fromAccountNumber: string;
    toAccountNumber: string;
    amount: number;
    date: string;
}

interface TransactionHistoryProps {
    accountId: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
    accountId,
}) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const isAuthenticated = useSelector(
        (state: AppState) => state.user.isAuthenticated,
    );

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const loadTransactionHistory = async () => {
            if (!accountId) return;
            setLoading(true);
            try {
                const data = await fetchTransactionHistory(
                    accountId,
                    currentPage - 1,
                );
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'TRY',
        }).format(amount);
    };

    if (!accountId) {
        return <p>Account ID is missing.</p>;
    }

    return (
        <div className="transaction-history-container">
            <List
                loading={loading}
                dataSource={transactions}
                renderItem={transaction => {
                    const isIncoming = transaction.toAccountId === accountId;
                    const transactionTypeClass = isIncoming
                        ? 'credit'
                        : 'debit';
                    const amountSign = isIncoming ? '+' : '-';

                    return (
                        <List.Item key={transaction.id}>
                            <Card
                                title={
                                    <div className="card-title-container">
                                        <span>
                                            Transaction {transaction.id}
                                        </span>
                                        <div
                                            className={`transaction-type ${transactionTypeClass}`}
                                        >
                                            {isIncoming ? (
                                                <ArrowDownOutlined />
                                            ) : (
                                                <ArrowUpOutlined />
                                            )}
                                            <span className="transaction-icon">
                                                {isIncoming
                                                    ? 'Credit'
                                                    : 'Debit'}
                                            </span>
                                        </div>
                                    </div>
                                }
                            >
                                <p>
                                    From Account:{' '}
                                    {transaction.fromAccountNumber}
                                </p>
                                <p>To Account: {transaction.toAccountNumber}</p>
                                <p>
                                    Amount:{' '}
                                    <span
                                        className={`amount ${transactionTypeClass}`}
                                    >
                                        {amountSign}{' '}
                                        {formatCurrency(transaction.amount)}{' '}
                                    </span>
                                </p>
                                <p>
                                    Date:{' '}
                                    {moment(transaction.date).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )}
                                </p>
                            </Card>
                        </List.Item>
                    );
                }}
            />
            <PaginationComponent
                currentPage={currentPage}
                totalItems={totalTransactions}
                onPageChange={handlePageChange}
            />
        </div>
    );
};
