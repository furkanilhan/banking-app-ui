import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchAccountById, updateAccount } from '../services/account';

const { Text } = Typography;

export const AccountUpdate: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const [accountNumber, setAccountNumber] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadAccountDetails = async () => {
            try {
                const account = await fetchAccountById(id!);
                form.setFieldsValue({ name: account.name, balance: account.balance });
                setAccountNumber(account.number);
            } catch (error) {
                message.error('Failed to load account details.');
            }
        };
        loadAccountDetails();
    }, [id, form]);

    const onFinish = async (values: { name: string; balance: number }) => {
        setLoading(true);
        try {
            await updateAccount(id!, values.name, values.balance);
            message.success('Account updated successfully!');
            navigate('/accounts');
        } catch (error) {
            message.error('Failed to update account.');
        }
        setLoading(false);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item label="Account Number">
                <Text>{accountNumber}</Text>
            </Form.Item>
            <Form.Item label="Account Name" name="name" rules={[{ required: true, message: 'Please input account name!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Balance" name="balance" rules={[{ required: true, message: 'Please input balance!' }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} style={{ marginRight: 8 }}>
                    Update Account
                </Button>
                <Button onClick={handleCancel}>
                    Cancel
                </Button>
            </Form.Item>
        </Form>
    );
};
