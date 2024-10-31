import React, { useState } from 'react';
import { Button, Popconfirm, Form, Input, Spin, message, DatePicker, TimePicker, List, Typography, Modal } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ShowtimeApi from '../../api/showtimeApi'; // Import ShowtimeApi
import moment from 'moment';

const { Text } = Typography;

const ShowtimeManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: showtimes, isLoading: loadingShowtimes } = useQuery({
    queryKey: ['showtimes'],
    queryFn: ShowtimeApi.getShowtimes,
  });

  const createShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.createShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(['showtimes']);
      message.success('Showtime created successfully');
    },
    onError: () => {
      message.error('Failed to create showtime');
    },
  });

  const updateShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.updateShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(['showtimes']);
      message.success('Showtime updated successfully');
    },
    onError: () => {
      message.error('Failed to update showtime');
    },
  });

  const deleteShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.deleteShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(['showtimes']);
      message.success('Showtime deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete showtime');
    },
  });

  const showModal = (showtime = null) => {
    setSelectedShowtime(showtime);
    if (showtime) {
      form.setFieldsValue({
        ...showtime,
        date: moment(showtime.start_time.split(' ')[0]),
        time: moment(showtime.start_time.split(' ')[1], 'HH:mm'),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        start_time: `${values.date.format('YYYY-MM-DD')} ${values.time.format('HH:mm:ss')}`,
        movie_id: values.movieId,
        projection_room_id: values.roomId,
        theater_id: values.theaterId,
      };
      if (selectedShowtime) {
        updateShowtimeMutation.mutate({ id: selectedShowtime.showtime_id, ...formattedValues });
      } else {
        createShowtimeMutation.mutate(formattedValues);
      }
      setIsModalVisible(false);
      form.resetFields();
      setSelectedShowtime(null);
    } catch (error) {
      message.error('Failed to save showtime');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedShowtime(null);
    form.resetFields();
  };

  const handleDelete = (showtimeId) => {
    deleteShowtimeMutation.mutate(showtimeId);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Button type="primary" onClick={() => showModal()} className="mb-6">
        Add Showtime
      </Button>
      <Modal
        title={selectedShowtime ? 'Update Showtime' : 'Add Showtime'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="movieId"
            label="Movie ID"
            rules={[{ required: true, message: 'Please input the movie ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="roomId"
            label="Room ID"
            rules={[{ required: true, message: 'Please input the room ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="theaterId"
            label="Theater ID"
            rules={[{ required: true, message: 'Please input the theater ID!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: 'Please select the date!' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: 'Please select the time!' }]}
          >
            <TimePicker className="w-full" format="HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
      {loadingShowtimes ? (
        <Spin tip="Loading showtimes..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {showtimes.map((showtime) => (
            <div key={showtime.showtime_id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <Text strong className="text-lg">Movie ID: {showtime.movie_id}</Text>
                <div>
                  <Button type="primary" onClick={() => showModal(showtime)} style={{ marginRight: '10px' }}>
                    Update
                  </Button>
                  <Popconfirm
                    title="Are you sure to delete this showtime?"
                    onConfirm={() => handleDelete(showtime.showtime_id)}
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
                dataSource={[
                  `Room ID: ${showtime.projection_room_id}`,
                  `Theater ID: ${showtime.theater_id}`,
                  `Start Time: ${moment(showtime.start_time).format('YYYY-MM-DD HH:mm')}`,
                ]}
                renderItem={(item) => (
                  <List.Item className="py-2">
                    <Text>{item}</Text>
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

export default ShowtimeManagement;
