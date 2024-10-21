import React from 'react';
import { List, Card } from 'antd';

const ProjectionRoomList = ({ projectionRooms }) => {
  return (
    <Card title="Projection Rooms">
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={projectionRooms}
        renderItem={item => (
          <List.Item>
            <Card title={item.name}>
              <p>Capacity: {item.capacity}</p>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default ProjectionRoomList;