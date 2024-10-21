import React from 'react';
import { List, Card } from 'antd';

const TheaterList = ({ theaters }) => {
  return (
    <Card title="Theaters">
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={theaters}
        renderItem={item => (
          <List.Item>
            <Card title={item.name}>
              <p>Location: {item.location}</p>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TheaterList;