import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Spin, message, InputNumber, List, Typography } from 'antd';
import TheaterApi from '../../api/theaterApi';

const { Text } = Typography;

const TheaterManagement = () => {
  const [theaters, setTheaters] = useState([]);
  const [loadingTheaters, setLoadingTheaters] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const theaterData = await TheaterApi.getTheaters();
        setTheaters(theaterData);
      } catch (error) {
        message.error('Failed to load theater data');
      } finally {
        setLoadingTheaters(false);
      }
    };

    fetchTheaters();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await TheaterApi.createTheater(values);
      message.success('Theater created successfully');
      setIsModalVisible(false);
      form.resetFields();
      const theaterData = await TheaterApi.getTheaters();
      setTheaters(theaterData);
    } catch (error) {
      message.error('Failed to create theater');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = async (theaterId) => {
    try {
      await TheaterApi.deleteTheater(theaterId);
      message.success('Theater deleted successfully');
      const theaterData = await TheaterApi.getTheaters();
      setTheaters(theaterData);
    } catch (error) {
      message.error('Failed to delete theater');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button type="primary" onClick={showModal} className="mb-6">
        Add Theater
      </Button>
      <Modal
        title="Add Theater"
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
                <Button type="link" danger onClick={() => handleDelete(theater.id)}>
                  Delete
                </Button>
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
