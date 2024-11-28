import React, { useState } from "react";
import {
  Button,
  Form,
  Select,
  DatePicker,
  TimePicker,
  message,
  Modal,
  Spin,
  List,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TheaterApi, MovieApi, ShowtimeApi } from '../../api';

import dayjs from "dayjs";
import PropTypes from "prop-types";

const { Option } = Select;

const ShowtimeManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Fetch movies
  const { data: movies = [], isLoading: loadingMovies } = useQuery({
    queryKey: ["movies"],
    queryFn: MovieApi.getMovies,
  });

  // Fetch theaters
  const { data: theaters = [], isLoading: loadingTheaters } = useQuery({
    queryKey: ["theaters"],
    queryFn: TheaterApi.getTheaters,
  });

  // Fetch showtimes
  const { data: showtimes = [], isLoading: loadingShowtimes } = useQuery({
    queryKey: ["showtimes"],
    queryFn: ShowtimeApi.getAllShowtimes,
  });

  // Create showtime mutation
  const createShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.createShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes"]);
      message.success("Showtime created successfully");
    },
    onError: () => {
      message.error("Failed to create showtime");
    },
  });

  // Update showtime mutation
  const updateShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.updateShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes"]);
      message.success("Showtime updated successfully");
    },
    onError: () => {
      message.error("Failed to update showtime");
    },
  });

  // Delete showtime mutation
  const deleteShowtimeMutation = useMutation({
    mutationFn: ShowtimeApi.deleteShowtime,
    onSuccess: () => {
      queryClient.invalidateQueries(["showtimes"]);
      message.success("Showtime deleted successfully");
    },
    onError: () => {
      message.error("Failed to delete showtime");
    },
  });

  // Handle theater selection to load rooms
  const handleTheaterChange = (theaterId) => {
    const theater = theaters.find((t) => t.id === theaterId);
    setRooms(theater?.projectionRoomList || []);
  };

  // Show modal for creating/updating showtime
  const showModal = (showtime = null) => {
    setSelectedShowtime(showtime);
    if (showtime) {
      form.setFieldsValue({
        ...showtime,
        date: dayjs(showtime.date),
        time: dayjs(showtime.time),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Submit form to create or update showtime
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const showtimeData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm"),
      };
      if (selectedShowtime) {
        updateShowtimeMutation.mutate({
          id: selectedShowtime.id,
          ...showtimeData,
        });
      } else {
        createShowtimeMutation.mutate(showtimeData);
      }
      setIsModalVisible(false);
      form.resetFields();
      setSelectedShowtime(null);
    } catch (error) {
      message.error("Failed to save showtime");
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
        title={selectedShowtime ? "Update Showtime" : "Add Showtime"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="movie"
            label="Movie"
            rules={[{ required: true, message: "Please select a movie!" }]}
          >
            <Select placeholder="Select a movie" loading={loadingMovies}>
              {movies.map((movie) => (
                <Option key={movie.id} value={movie.id}>
                  {movie.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="theater"
            label="Theater"
            rules={[{ required: true, message: "Please select a theater!" }]}
          >
            <Select
              placeholder="Select a theater"
              loading={loadingTheaters}
              onChange={handleTheaterChange}
            >
              {theaters.map((theater) => (
                <Option key={theater.id} value={theater.id}>
                  {theater.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="room"
            label="Room"
            rules={[{ required: true, message: "Please select a room!" }]}
          >
            <Select placeholder="Select a room">
              {rooms.map((room) => (
                <Option key={room.id} value={room.id}>
                  Room {room.number}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select a time!" }]}
          >
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      {loadingShowtimes ? (
        <Spin tip="Loading showtimes..." />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={showtimes}
          renderItem={(showtime) => (
            <List.Item
              key={showtime.id}
              actions={[
                <Button key="update" onClick={() => showModal(showtime)}>
                  Update
                </Button>,
                <Button
                  key="delete"
                  danger
                  onClick={() => handleDelete(showtime.id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={`Movie: ${showtime.movieTitle}`}
                description={`Theater: ${showtime.theaterName} | Room: ${showtime.roomNumber} | Date: ${showtime.date} | Time: ${showtime.time}`}
              />
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

ShowtimeManagement.propTypes = {
  // Nếu cần thêm propTypes cho component
};

export default ShowtimeManagement;
