import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { TokenManager } from '../api/apiClient'; // Remove axiosInstance as we will call TokenManager
import axios from 'axios';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      localStorage.setItem('username', values.username);
      localStorage.setItem('password', values.password);

      const accessToken = await TokenManager.getAccessToken({
        username: values.username,
        password: values.password,
      });

      if (accessToken) {
        navigate('/admin'); // Redirect to admin if role is ADMIN
      } else {
        navigate('/user'); // Redirect to user homepage
      }
    } catch (error) {
      console.error('Error logging in:', error);
      message.error('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" 
           id="login_password" 
           aria-required="true" 
           autoComplete="current-password"  // Add autocomplete attribute
           className="ant-input "/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
