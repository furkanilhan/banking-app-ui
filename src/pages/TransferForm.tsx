import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Select } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { initiateTransfer } from '../services/transaction';
import { fetchAccounts } from '../services/account';

const { Option } = Select;

interface Account {
    id: string;
    name: string;
}

export const TransferForm: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const data = await fetchAccounts(0);
                setAccounts(data.content);

                const params = new URLSearchParams(location.search);
                const fromAccountId = params.get('fromAccountId');
                if (fromAccountId) {
                    form.setFieldsValue({ fromAccountId });
                }
            } catch (error) {
                message.error('Failed to load accounts.');
            }
        };

        loadAccounts();
    }, [location.search, form]);

    const onFinish = async (values: { fromAccountId: string; toAccountId: string; amount: number }) => {
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
                    name="fromAccountId"
                    rules={[{ required: true, message: 'Please select the sender account!' }]}
                >
                    <Select placeholder="Select sender account">
                        {accounts.map((account) => (
                            <Option key={account.id} value={account.id}>
                                {account.name} ({account.id})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="To Account ID"
                    name="toAccountId"
                    rules={[{ required: true, message: 'Please input the recipient account ID!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: 'Please input the amount to transfer!' }]}
                >
                    <Input type="number" />
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
