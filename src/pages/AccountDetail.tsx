import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, message, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteAccount as deleteAccountService } from '../services/account';
import { TransactionHistory } from './TransactionHistory';
import { AppState } from '../store/store';
import { deleteAccount } from '../store/accountReducer';

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
        }
    }, [isAuthenticated, navigate]);

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

    const handleDelete = async () => {
        try {
            await deleteAccountService(id!);
            dispatch(deleteAccount(id!));
            message.success('Account deleted successfully!');
            navigate('/accounts');
        } catch (error) {
            message.error('Failed to delete account.');
        } finally {
            setIsModalVisible(false);
        }
    };

    const handleCancelDelete = () => {
        setIsModalVisible(false);
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
                        title={account.name}
                        actions={[
                            <Button type="primary" onClick={handleEdit}>
                                Edit
                            </Button>,
                            <Button type="primary" onClick={handleTransfer}>
                                Transfer
                            </Button>,
                            <Button type="primary" danger onClick={showDeleteModal}>
                                Delete
                            </Button>
                        ]}
                    >
                        <p>Account Number: {account.number}</p>
                        <p>Balance: {account.balance} USD</p>
                    </Card>
                    <TransactionHistory accountId={account.id} />
                </>
            ) : (
                <p>Account not found.</p>
            )}

            <Modal
                title="Delete Account"
                open={isModalVisible}
                onOk={handleDelete}
                onCancel={handleCancelDelete}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this account?</p>
            </Modal>
        </div>
    );
};
