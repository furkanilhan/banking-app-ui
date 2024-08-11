import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/userActions';
import { Form, Input, Button, Card, message } from 'antd';
import { login } from '../services/auth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onFinish = async (values: { username: string; password: string }) => {
        try {
            const data = await login(values.username, values.password);

            const user = {
                id: data.id,
                username: data.username,
                roles: data.roles,
            };

            dispatch(loginSuccess(data.token, user));
            navigate('/accounts');
            
        } catch (error: any) {
            console.error('Login failed:', error);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;

                message.error(errorMessage);
                
            } else {
                message.error('An error occurred during login.');
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Card title="Login" style={{ width: 300 }}>
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please enter your username!' }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center' }}>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
