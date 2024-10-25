import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, Spin, message } from 'antd';
import TheaterApi from '../../api/theaterApi';

const TheaterManagement = () => {
  const [theaters, setTheaters] = useState([]);
  const [loadingTheaters, setLoadingTheaters] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const theaterData = await TheaterApi.getTheaters();
        console.log('Fetched theater data:', theaterData);
        setTheaters(theaterData);
      } catch (error) {
        console.error('Error fetching theater data:', error);
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
      console.error('Error creating theater:', error);
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
      console.error('Error deleting theater:', error);
      message.error('Failed to delete theater');
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
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
        </Form>
      </Modal>
      {loadingTheaters ? (
        <Spin tip="Loading theaters..." />
      ) : (
        <ul>
          {theaters.map((theater) => (
            <li key={theater.id}>
              {theater.name}
              <Button type="link" onClick={() => handleDelete(theater.id)}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TheaterManagement;