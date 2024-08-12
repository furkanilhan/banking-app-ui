import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';
const Register: React.FC = () => {
    const navigate = useNavigate();

    const onFinish = async (values: {
        username: string;
        email: string;
        password: string;
    }) => {
        try {
            await register(values.username, values.email, values.password);

            message.success('Registration successful! You can now log in.');
            navigate('/login');
        } catch (error: any) {
            console.error('Registration failed:', error);

            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                const errorMessage = error.response.data.message;

                message.error(errorMessage);
            } else {
                message.error('An error occurred during registration.');
            }
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Card title="Register" style={{ width: 300 }}>
                <Form
                    name="register"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your username!',
                            },
                        ]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your email!',
                            },
                            {
                                type: 'email',
                                message: 'Please enter a valid email!',
                            },
                        ]}
                    >
                        <Input placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your password!',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ width: '100%' }}
                        >
                            Register
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{ textAlign: 'center' }}>
                    <p>
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default Register;
