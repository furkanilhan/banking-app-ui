import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, message, Select, InputNumber } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { initiateTransfer } from '../services/transaction';
import { AppState } from '../store/store';

const { Option } = Select;

interface Account {
    id: string;
    number: string;
    name: string;
}

export const TransferForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = useSelector((state: AppState) => state.user.isAuthenticated);
    const allAccounts = useSelector((state: AppState) => state.accounts.accounts);
    const selectedAccount = useSelector((state: AppState) => state.accounts.selectedAccount);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        } else {
            setAccounts(allAccounts);

            const params = new URLSearchParams(location.search);
            const fromAccountId = params.get('fromAccountId');

            if (selectedAccount && fromAccountId) {
                form.setFieldsValue({ fromAccountNumber: selectedAccount.number });
            }
        }
    }, [isAuthenticated, navigate, allAccounts, selectedAccount, form]);

    const onFinish = async (values: { fromAccountNumber: string; toAccountNumber: string; amount: number }) => {
        setLoading(true);
        try {
            await initiateTransfer(values);
            message.success('Transaction completed successfully!');
            navigate('/accounts');
        } catch (error) {
            message.error('Failed to complete transaction.');
        }
        setLoading(false);
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div>
            <Button onClick={handleBack} style={{ marginBottom: 16 }}>
                Back
            </Button>
            <Form form={form} onFinish={onFinish} layout="vertical">
                <Form.Item
                    label="From Account"
                    name="fromAccountNumber"
                    initialValue={''}
                    rules={[{ required: true, message: 'Please select the sender account!' }]}
                >
                    <Select placeholder="Select sender account" allowClear>
                        {accounts.map((account: Account) => (
                            <Option key={account.number} value={account.number}>
                                {account.name} ({account.number})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="To Account Number"
                    name="toAccountNumber"
                    rules={[{ required: true, message: 'Please input the recipient account number!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please input the amount to transfer!' }]}
                >
                    <InputNumber<number>
                        min={0}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                        Transfer
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};
