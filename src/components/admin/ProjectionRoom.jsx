import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  message,
  Spin,
  Popconfirm,
} from "antd";
import PropTypes from "prop-types"; // Import prop-types
import ProjectionRoomApi from "../../api/projectionRoomApi";

const ProjectionRoom = ({ theater, onClose, refreshTheaters }) => {
  const [rooms, setRooms] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomData = await ProjectionRoomApi.getAllRoomByMovieID(
          theater.id
        );
        setRooms(roomData);
      } catch (error) {
        message.error("Failed to load rooms");
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, [theater]);

  const handleAddRoom = async () => {
    try {
      const values = await form.validateFields();
      if (selectedRoom) {
        await ProjectionRoomApi.updateRoom(selectedRoom.id, values);
        message.success("Room updated successfully");
      } else {
        await ProjectionRoomApi.createRoom(theater.id, values);
        message.success("Room added successfully");
      }
      form.resetFields();
      setIsModalVisible(false);
      refreshTheaters();
      setSelectedRoom(null);
    } catch (error) {
      message.error("Failed to save room");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      await ProjectionRoomApi.deleteRoom(roomId);
      message.success("Room deleted successfully");
      refreshTheaters();
    } catch (error) {
      message.error("Failed to delete room");
    }
  };

  const handleUpdateRoom = (room) => {
    form.setFieldsValue(room);
    setSelectedRoom(room);
    setIsModalVisible(true);
  };

  return (
    <Modal
      visible
      onCancel={onClose}
      footer={null}
      title={`${theater.name} - Projection Rooms`}
    >
      {loadingRooms ? (
        <Spin tip="Loading rooms..." />
      ) : (
        <List
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item key={room.id}>
              <div className="flex justify-between w-full">
                Room {room.number}: {room.seats} seats
                <Button
                  type="link"
                  onClick={() => handleUpdateRoom(room)}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure to delete this room?"
                  onConfirm={() => handleDeleteRoom(room.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </List.Item>
          )}
        />
      )}
      <Button onClick={() => setIsModalVisible(true)}>Add New Room</Button>
      <Modal
        title={selectedRoom ? "Update Room" : "Add Room"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedRoom(null);
          form.resetFields();
        }}
        onOk={handleAddRoom}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="number"
            label="Room Number"
            rules={[
              { required: true, message: "Please input the room number!" },
            ]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item
            name="seats"
            label="Seats"
            rules={[
              { required: true, message: "Please input the number of seats!" },
            ]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </Modal>
  );
};

// Định nghĩa kiểu cho props
ProjectionRoom.propTypes = {
  theater: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  refreshTheaters: PropTypes.func.isRequired,
};

export default ProjectionRoom;