import React, { useState } from 'react';
import { Button, Popconfirm, Form, Input, Spin, message, List, Typography, Modal } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserApi from '../../api/userApi'; // Adjust the path to your actual UserApi file
const { Text } = Typography;

const UserManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: UserApi.getAllUser, // API call to fetch users
  });

  const createUserMutation = useMutation({
    mutationFn: UserApi.createUser, // API call to create a new user
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      message.success('User created successfully');
    },
    onError: () => {
      message.error('Failed to create user');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: UserApi.updateUser, // API call to update user data
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      message.success('User updated successfully');
    },
    onError: () => {
      message.error('Failed to update user');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: UserApi.deleteUser, // API call to delete a user
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      message.success('User deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete user');
    },
  });

  const showModal = (user = null) => {
    setSelectedUser(user);
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedUser) {
        updateUserMutation.mutate({ id: selectedUser.id, ...values });
      } else {
        createUserMutation.mutate(values);
      }
      setIsModalVisible(false);
      form.resetFields();
      setSelectedUser(null);
    } catch (error) {
      message.error('Failed to save user');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleDelete = (userId) => {
    deleteUserMutation.mutate(userId);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button type="primary" onClick={() => showModal()} className="mb-6">
        Add User
      </Button>
      <Modal
        title={selectedUser ? 'Update User' : 'Add User'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the user name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the user email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please input the user role!' }]}
          >
            <Input placeholder="e.g., Admin, Customer, Manager" />
          </Form.Item>
        </Form>
      </Modal>
      {loadingUsers ? (
        <Spin tip="Loading users..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <Text strong className="text-lg">{user.username}</Text>
                <div>
                  <Button type="primary" onClick={() => showModal(user)} style={{ marginRight: '10px' }}>
                    Update
                  </Button>
                  <Popconfirm
                    title="Are you sure to delete this user?"
                    onConfirm={() => handleDelete(user.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button className="bg-red-700 text-white">Delete</Button>
                  </Popconfirm>
                </div>
              </div>
              <List
                size="small"
                bordered
                dataSource={[`Email: ${user.email}`, `Role: ${user.roles[0].name}`]}
                renderItem={(info) => (
                  <List.Item className="py-2">
                    <Text>{info}</Text>
                  </List.Item>
                )}
                className="rounded-md border-gray-200"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
