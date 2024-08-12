import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Card, Input, message, Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAccounts } from '../services/account';
import { setAccounts, setSelectedAccount } from '../store/accountReducer';
import { AppState } from '../store/store';
import { PaginationComponent } from '../components/PaginationComponent/PaginationComponent';
import { DeleteModalComponent } from '../components/DeleteModalComponent/DeleteModalComponent';
import './Accounts.scss'

const { Search } = Input;

export const Accounts: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [nameSearch, setNameSearch] = useState<string>('');
    const [numberSearch, setNumberSearch] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState(0);

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
            setTotalItems(data.totalElements)
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
        navigate(fromAccountId ? `/transfer?fromAccountId=${fromAccountId}` : '/transfer');
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

    const handleAccountDeleted = () => {
        if (accounts.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
            handlePageChange(currentPage - 1);
        } else {
            loadAccounts(currentPage - 1, nameSearch, numberSearch);
        }
    };

    const showDeleteModal = (id: string) => {
        setDeletingAccountId(id);
        setIsModalVisible(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'TRY' }).format(amount);
    };

    const handleClearSearchName = () => {
        setNameSearch('');
        const params = new URLSearchParams(location.search);
        params.set('name', '');
        params.set('page', '1');
        navigate(`?${params.toString()}`);
    };

    const handleClearSearchNumber = () => {
        setNumberSearch('');
        const params = new URLSearchParams(location.search);
        params.set('number', '');
        params.set('page', '1');
        navigate(`?${params.toString()}`);
    };

    return (
        <div className="container">
            <div className="search-container">
                <div className="search-group">
                    <Input
                        className="search-input"
                        placeholder="Search by account name"
                        value={nameSearch}
                        onChange={(e) => setNameSearch(e.target.value)}
                        allowClear
                        onClear={handleClearSearchName}
                    />
                    <Input
                        className="search-input"
                        placeholder="Search by account number"
                        value={numberSearch}
                        onChange={(e) => setNumberSearch(e.target.value)}
                        allowClear
                        onClear={handleClearSearchNumber}
                    />
                    <Button 
                        type="primary" 
                        onClick={handleSearch}
                        icon={<SearchOutlined />}
                        className="custom-button"
                    >
                        Search
                    </Button>
                </div>
                <div className="button-group">
                    <Button 
                        type="primary" 
                        onClick={handleCreateAccount}
                        icon={<PlusOutlined />}
                        className="custom-button"
                    >
                        Create Account
                    </Button>
                    <Button 
                        type="primary" 
                        onClick={() => handleTransfer()}
                        icon={<SwapOutlined />}
                        className="custom-button"
                    >
                        Transfer
                    </Button>
                </div>
            </div>

            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={accounts}
                renderItem={(account) => (
                    <List.Item>
                        <Card
                            title={
                                <div className="card-title-container">
                                    <a className="card-title" onClick={() => handleViewAccountDetails(account.id)}>
                                        {account.name}
                                    </a>
                                    <div className="card-actions">
                                        <Tooltip title="Update">
                                            <Button 
                                                type="link" 
                                                icon={<EditOutlined />} 
                                                onClick={() => handleUpdateAccount(account.id)} 
                                                className="icon-button" 
                                            />
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <Button 
                                                type="link" 
                                                icon={<DeleteOutlined />} 
                                                onClick={() => showDeleteModal(account.id)} 
                                                className="icon-button" 
                                            />
                                        </Tooltip>
                                        <Tooltip title="Transfer">
                                            <Button 
                                                type="link" 
                                                icon={<SwapOutlined />} 
                                                onClick={() => handleTransfer(account.id)} 
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
                    </List.Item>
                )}
            />
            <PaginationComponent
                currentPage={currentPage}
                totalItems={totalItems}
                onPageChange={handlePageChange}
            />

            <DeleteModalComponent
                isVisible={isModalVisible}
                deletingAccountId={deletingAccountId}
                onCancel={() => setIsModalVisible(false)}
                onAccountDeleted={handleAccountDeleted}
            />
        </div>
    );
};
