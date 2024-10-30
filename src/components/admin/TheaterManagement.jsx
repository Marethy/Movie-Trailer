import React, { useState } from 'react';
import { Button, Popconfirm, Form, Input, Spin, message, InputNumber, List, Typography, Modal } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TheaterApi from '../../api/theaterApi';
import ProjectionRoom from './ProjectionRoom'; // Import ProjectionRoom component
const { Text } = Typography;

const TheaterManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: theaters, isLoading: loadingTheaters } = useQuery({
    queryKey: ['theaters'], // Updated to object form
    queryFn: TheaterApi.getTheaters,
  });

  const createTheaterMutation = useMutation({
    mutationFn: TheaterApi.createTheater,
    onSuccess: () => {
      queryClient.invalidateQueries(['theaters']);
      message.success('Theater created successfully');
    },
    onError: () => {
      message.error('Failed to create theater');
    },
  });

  const updateTheaterMutation = useMutation({
    mutationFn: TheaterApi.updateTheater,
    onSuccess: () => {
      queryClient.invalidateQueries(['theaters']);
      message.success('Theater updated successfully');
    },
    onError: () => {
      message.error('Failed to update theater');
    },
  });

  const deleteTheaterMutation = useMutation({
    mutationFn: TheaterApi.deleteTheater,
    onSuccess: () => {
      queryClient.invalidateQueries(['theaters']);
      message.success('Theater deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete theater');
    },
  });

  const showModal = (theater = null) => {
    setSelectedTheater(theater);
    if (theater) {
      form.setFieldsValue(theater);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedTheater) {
        updateTheaterMutation.mutate({ id: selectedTheater.id, ...values });
      } else {
        createTheaterMutation.mutate(values);
      }
      setIsModalVisible(false);
      form.resetFields();
      setSelectedTheater(null);
    } catch (error) {
      message.error('Failed to save theater');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTheater(null);
    form.resetFields();
  };

  const handleDelete = (theaterId) => {
    deleteTheaterMutation.mutate(theaterId);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button type="primary" onClick={() => showModal()} className="mb-6">
        Add Theater
      </Button>
      <Modal
        title={selectedTheater ? 'Update Theater' : 'Add Theater'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the theater name!' }]}
          >
            <Input />
          </Form.Item>
    
          <Form.List name="projectionRoomList">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} className="flex items-center space-x-4">
                    <Form.Item
                      {...field}
                      name={[field.name, 'number']}
                      label="Room Number"
                      rules={[{ required: true, message: 'Please input the room number!' }]}
                    >
                      <InputNumber min={1} placeholder="Room Number" className="w-full" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'seats']}
                      label="Seats"
                      rules={[{ required: true, message: 'Please input the number of seats!' }]}
                    >
                      <InputNumber min={1} placeholder="Seats" className="w-full" />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(field.name)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} className="w-full">
                    Add Room
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      {loadingTheaters ? (
        <Spin tip="Loading theaters..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {theaters.map((theater) => (
            <div key={theater.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <Text strong className="text-lg">{theater.name}</Text>
                <div>
                  <Button type="primary" onClick={() => showModal(theater)} style={{ marginRight: '10px' }}>
                    Update
                  </Button>
                  <Popconfirm
                    title="Are you sure to delete this theater?"
                    onConfirm={() => handleDelete(theater.id)}
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
                dataSource={theater.projectionRoomList}
                renderItem={(room) => (
                  <List.Item className="py-2">
                    Room {room.number}: <Text>{room.seats} seats</Text>
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

export default TheaterManagement;
