import React, { useEffect, useState } from 'react';
import { List, Card, Input, Pagination, message, Row, Col, Button, Modal } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAccounts, deleteAccount } from '../services/account';

const { Search } = Input;

interface Account {
    id: string;
    name: string;
    number: string;
    balance: number;
}

export const Accounts: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [nameSearch, setNameSearch] = useState<string>('');
    const [numberSearch, setNumberSearch] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const loadAccounts = async (page: number, name?: string, number?: string) => {
        setLoading(true);
        try {
            const data = await fetchAccounts(page, name, number);
            setAccounts(data.content);
            setTotalAccounts(data.totalElements);
        } catch (error: any) {
            console.error('Fetching accounts failed:', error);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                message.error(errorMessage);
            } else {
                message.error('An unexpected error occurred.');
            }
        }
        setLoading(false);
    };

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

    const handleSearch = () => {
        const params = new URLSearchParams(location.search);
        params.set('name', nameSearch);
        params.set('number', numberSearch);
        params.set('page', '1');
        navigate(`?${params.toString()}`);
        loadAccounts(0, nameSearch, numberSearch);
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(location.search);
        params.set('page', page.toString());
        navigate(`?${params.toString()}`);
    };

    const handleCreateAccount = () => {
        navigate('/accounts/create');
    };

    const handleUpdateAccount = (id: string) => {
        navigate(`/accounts/update/${id}`);
    };

    const handleViewAccountDetails = (id: string) => {
        navigate(`/accounts/${id}`);
    };

    const showDeleteModal = (id: string) => {
        setDeletingAccountId(id);
        setIsModalVisible(true);
    };

    const handleDeleteAccount = async () => {
        if (deletingAccountId) {
            try {
                await deleteAccount(deletingAccountId);
                message.success('Account deleted successfully!');
                setIsModalVisible(false);
                setDeletingAccountId(null);
                loadAccounts(currentPage - 1, nameSearch, numberSearch);
            } catch (error) {
                message.error('Failed to delete account.');
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
                <Col span={8}>
                    <Search
                        placeholder="Search by account name"
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                    />
                </Col>
                <Col span={8}>
                    <Search
                        placeholder="Search by account number"
                        value={numberSearch}
                        onChange={(e) => setNumberSearch(e.target.value)}
                    />
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Col>
                <Col span={4}>
                    <Button type="primary" onClick={handleCreateAccount}>
                        Create Account
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
                                </Button>
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
                total={totalAccounts}
                onChange={handlePageChange}
                style={{ marginTop: 16 }}
            />

            <Modal
                title="Delete Account"
                visible={isModalVisible}
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
