import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { TransactionHistory } from './TransactionHistory';
import { AppState } from '../store/store';
import { deleteAccount } from '../store/accountReducer';
import { DeleteModalComponent } from '../components/DeleteModalComponent/DeleteModalComponent';

export const AccountDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
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

    const handleCancelDelete = () => {
        setIsModalVisible(false);
    };

    const handleAccountDeleted = () => {
        dispatch(deleteAccount(id!));
        navigate('/accounts');
    };

    return (
        <div>
            <Button onClick={handleBack} style={{ marginBottom: 16 }}>
                Back
            </Button>
            {account ? (
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

            <DeleteModalComponent
                deletingAccountId={id || null}
                isVisible={isModalVisible}
                onCancel={handleCancelDelete}
                onAccountDeleted={handleAccountDeleted}
            />
        </div>
    );
};
