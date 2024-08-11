import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, message } from 'antd';
import { createAccount } from '../services/account';
import { useNavigate } from 'react-router-dom';
import { AppState } from '../store/store';

export const AccountCreate: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: AppState) => state.user.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const onFinish = async (values: { name: string; initialBalance: number }) => {
        setLoading(true);
        try {
            await createAccount(values.name, values.initialBalance);
            message.success('Account created successfully!');
            navigate('/accounts');
        } catch (error) {
            message.error('Failed to create account.');
        }
        setLoading(false);
    };

    return (
        <Form onFinish={onFinish} layout="vertical">
            <Form.Item label="Account Name" name="name" rules={[{ required: true, message: 'Please input account name!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Initial Balance" name="initialBalance" rules={[{ required: true, message: 'Please input initial balance!' }]}>
                <Input type="number" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create Account
                </Button>
            </Form.Item>
        </Form>
    );
};
