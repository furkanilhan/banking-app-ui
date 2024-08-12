import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button, message, Typography, InputNumber } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { updateAccount } from '../services/account';
import { AppState } from '../store/store';
import { updateAccount as updateAccountInStore } from '../store/accountReducer';

const { Text } = Typography;

export const AccountUpdate: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(
        (state: AppState) => state.user.isAuthenticated,
    );
    const account = useSelector((state: AppState) =>
        state.accounts.accounts.find(account => account.id === id),
    );

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const loadAccountDetails = async () => {
            if (account) {
                form.setFieldsValue({
                    name: account.name,
                    balance: account.balance,
                });
            } else {
                message.error('Failed to load account details.');
            }
        };
        loadAccountDetails();
    }, [id, form, account, dispatch]);

    const onFinish = async (values: { name: string; balance: number }) => {
        setLoading(true);
        try {
            const updatedAccount = await updateAccount(
                id!,
                values.name,
                values.balance,
            );
            dispatch(updateAccountInStore(updatedAccount));
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
                <Text>{account?.number}</Text>
            </Form.Item>
            <Form.Item
                label="Account Name"
                name="name"
                rules={[
                    { required: true, message: 'Please input account name!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Balance"
                name="balance"
                rules={[{ required: true, message: 'Please input balance!' }]}
            >
                <InputNumber<number>
                    min={0}
                    formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    parser={value =>
                        value?.replace(/\$\s?|(,*)/g, '') as unknown as number
                    }
                    style={{ width: '100%' }}
                />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    style={{ marginRight: 8 }}
                >
                    Update Account
                </Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </Form.Item>
        </Form>
    );
};
