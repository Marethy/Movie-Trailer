import React, { useState } from "react";
import {
  Button,
  Popconfirm,
  Form,
  Input,
  Spin,
  message,
  Modal,
  Table,
  DatePicker,
  Switch,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "../../api";
import moment from "moment";

const UserManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: UserApi.getAllUser,
  });

  const createUserMutation = useMutation({
    mutationFn: UserApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      message.success("User created successfully");
    },
    onError: () => {
      message.error("Failed to create user");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: UserApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      message.success("User updated successfully");
    },
    onError: () => {
      message.error("Failed to update user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: UserApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      message.success("User deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete user");
      console.log(error);
    },
  });

  const showModal = (user = null) => {
    setSelectedUser(user);
    if (user) {
      form.setFieldsValue({
        ...user,
        dob: user.dob ? moment(user.dob) : null,
        is_active: !!user.is_active,
      });
    } else {
      //  form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Chuyển đổi dữ liệu đầu vào thành định dạng cần thiết
      const payload = {
        username: values.username,
        password: values.password || "default_password", // Thêm password mặc định nếu không có
        email: values.email,
        birthday: values.dob ? values.dob.format("YYYY-MM-DD") : null,
        fullName: values.fullName,
        phoneNumber: values.phone,
        active: values.is_active ?? false,
      };

      console.log("Payload to send:", payload);

      if (selectedUser) {
        updateUserMutation.mutate({ id: selectedUser.id, ...payload });
      } else {
        createUserMutation.mutate(payload);
      }

      setIsModalVisible(false);
      form.resetFields();
      setSelectedUser(null);
    } catch (error) {
      console.log(error);
      message.error("Failed to save user");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleDelete = (id) => {
    try {
      deleteUserMutation.mutate(id);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
      render: (dob) => (dob ? moment(dob).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (is_active ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => showModal(record)}
            style={{ marginRight: "10px" }}
          >
            Update
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button className="bg-red-700 text-white">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button type="primary" onClick={() => showModal()} className="mb-6">
        Add User
      </Button>
      <Modal
        title={selectedUser ? "Update User" : "Add User"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please input the user name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the user email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input the username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="dob" label="Date of Birth">
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="is_active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
      {loadingUsers ? (
        <Spin tip="Loading users..." />
      ) : (
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: 1000 }}
        />
      )}
    </div>
  );
};

export default UserManagement;
