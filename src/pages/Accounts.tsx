import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Card, Input, Pagination, message, Row, Col, Button, Modal } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAccounts, deleteAccount as deleteAccountService } from '../services/account';
import { setAccounts, deleteAccount, setSelectedAccount } from '../store/accountReducer';
import { AppState } from '../store/store';

const { Search } = Input;

export const Accounts: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [nameSearch, setNameSearch] = useState<string>('');
    const [numberSearch, setNumberSearch] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const accounts = useSelector((state: AppState) => state.accounts.accounts);
    const isAuthenticated = useSelector((state: AppState) => state.user.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page') || '1', 10);
        const name = params.get('name') || '';
        const number = params.get('number') || '';
        setCurrentPage(page);
        setNameSearch(name);
        setNumberSearch(number);
        loadAccounts(page - 1, name, number);
    }, [location.search]);

    const loadAccounts = async (page: number, name?: string, number?: string) => {
        setLoading(true);
        try {
            const data = await fetchAccounts(page, name, number);
            dispatch(setAccounts(data.content));
        } catch (error: any) {
            console.error('Fetching accounts failed:', error);
            message.error(error.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams(location.search);
        params.set('name', nameSearch);
        params.set('number', numberSearch);
        params.set('page', '1');
        navigate(`?${params.toString()}`);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page.toString());
        navigate(`?${params.toString()}`);
    };

    const handleCreateAccount = () => {
        navigate('/accounts/create');
    };

    const handleTransfer = (fromAccountId?: string) => {
        navigate(`/transfer?fromAccountId=${fromAccountId}`);
    };

    const handleUpdateAccount = (id: string) => {
        navigate(`/accounts/update/${id}`);
    };

    const handleViewAccountDetails = (id: string) => {
        const selectedAccount = accounts.find(account => account.id === id);
        if (selectedAccount) {
            dispatch(setSelectedAccount(selectedAccount));
            navigate(`/accounts/${id}`);
        }
    };

    const showDeleteModal = (id: string) => {
        setDeletingAccountId(id);
        setIsModalVisible(true);
    };

    const handleDeleteAccount = async () => {
        if (deletingAccountId) {
            try {
                await deleteAccountService(deletingAccountId);
                dispatch(deleteAccount(deletingAccountId));
                message.success('Account deleted successfully!');
            } catch (error) {
                message.error('Failed to delete account.');
            } finally {
                setIsModalVisible(false);
                setDeletingAccountId(null);
            }
        }
    };

    const handleCancelDelete = () => {
        setIsModalVisible(false);
        setDeletingAccountId(null);
    };

    return (
        <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col span={6}>
                    <Search
                        placeholder="Search by account name"
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                    />
                </Col>
                <Col span={6}>
                    <Search
                        placeholder="Search by account number"
                        value={numberSearch}
                        onChange={(e) => setNumberSearch(e.target.value)}
                    />
                </Col>
                <Col span={6}>
                    <Button type="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={handleCreateAccount}>
                        Create Account
                    </Button>
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={() => handleTransfer()}>
                        Transfer
                    </Button>
                </Col>
            </Row>
            <List
                loading={loading}
                grid={{ gutter: 16, column: 1 }}
                dataSource={accounts}
                renderItem={(account) => (
                    <List.Item>
                        <Card
                            title={
                                <a onClick={() => handleViewAccountDetails(account.id)}>
                                    {account.name}
                                </a>
                            }
                            actions={[
                                <Button type="link" onClick={() => handleUpdateAccount(account.id)}>
                                    Update
                                </Button>,
                                <Button type="link" danger onClick={() => showDeleteModal(account.id)}>
                                    Delete
                                </Button>,
                                <Button type="link" onClick={() => handleTransfer(account.id)}>
                                    Transfer
                                </Button>,
                            ]}
                        >
                            <p>Account Number: {account.number}</p>
                            <p>Balance: {account.balance} USD</p>
                        </Card>
                    </List.Item>
                )}
            />
            <Pagination
                current={currentPage}
                pageSize={5}
                total={accounts.length}
                onChange={handlePageChange}
                style={{ marginTop: 16 }}
            />

            <Modal
                title="Delete Account"
                open={isModalVisible}
                onOk={handleDeleteAccount}
                onCancel={handleCancelDelete}
                okText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this account?</p>
            </Modal>
        </div>
    );
};
