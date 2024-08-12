import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, Tooltip, message } from 'antd';
import { EditOutlined, DeleteOutlined, SwapOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { TransactionHistory } from './TransactionHistory';
import { AppState } from '../store/store';
import { deleteAccount, setSelectedAccount } from '../store/accountReducer';
import { fetchAccountById } from '../services/account';
import { DeleteModalComponent } from '../components/DeleteModalComponent/DeleteModalComponent';
import './AccountDetail.scss';

export const AccountDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isAuthenticated = useSelector((state: AppState) => state.user.isAuthenticated);
    const account = useSelector((state: AppState) => state.accounts.selectedAccount);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (!account) {
            loadAccount(id!);
        }
    }, [isAuthenticated, navigate, account, id]);

    const loadAccount = async (accountId: string) => {
        setLoading(true);
        try {
            const data = await fetchAccountById(accountId);
            dispatch(setSelectedAccount(data));
        } catch (error) {
            message.error('Account not found.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        navigate(`/accounts/update/${id}`);
    };

    const handleTransfer = () => {
        navigate(`/transfer?fromAccountId=${id}`);
    };

    const showDeleteModal = () => {
        setIsModalVisible(true);
    };

    const handleCancelDelete = () => {
        setIsModalVisible(false);
    };

    const handleAccountDeleted = () => {
        dispatch(deleteAccount(id!));
        navigate('/accounts');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TRY' }).format(amount);
    };

    return (
        <div>
            <Button onClick={handleBack} style={{ marginBottom: 16 }}>
                Back
            </Button>
            {loading ? (
                <p>Loading...</p>
            ) : account ? (
                <>
                    <Card
                        title={
                            <div className="card-title-container">
                                <a className="card-title">
                                    {account.name}
                                </a>
                                <div className="card-actions">
                                    <Tooltip title="Update">
                                        <Button 
                                            type="link" 
                                            icon={<EditOutlined />} 
                                            onClick={handleEdit} 
                                            className="icon-button" 
                                        />
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                        <Button 
                                            type="link" 
                                            icon={<DeleteOutlined />} 
                                            onClick={showDeleteModal} 
                                            className="icon-button" 
                                        />
                                    </Tooltip>
                                    <Tooltip title="Transfer">
                                        <Button 
                                            type="link" 
                                            icon={<SwapOutlined />} 
                                            onClick={handleTransfer} 
                                            className="icon-button" 
                                        />
                                    </Tooltip>
                                </div>
                            </div>
                        }
                    >
                        <div className="account-details">
                            <div className="account-item">
                                <span className="account-key">Account Number:</span>
                                <span className="account-value">{account.number}</span>
                            </div>
                            <div className="account-item">
                                <span className="account-key">Balance:</span>
                                <span className="account-value">{formatCurrency(account.balance)}</span>
                            </div>
                        </div>
                    </Card>
                    <TransactionHistory accountId={account.id} />
                </>
            ) : (
                <p>Account not found.</p>
            )}

            <DeleteModalComponent
                deletingAccountId={id || null}
                isVisible={isModalVisible}
                onCancel={handleCancelDelete}
                onAccountDeleted={handleAccountDeleted}
            />
        </div>
    );
};
