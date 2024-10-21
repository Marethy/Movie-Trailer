import React from 'react';
import { List, Card } from 'antd';

const MovieList = ({ movies }) => {
  return (
    <Card title="Movies">
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={movies}
        renderItem={item => (
          <List.Item>
            <Card title={item.title}>
              <p>Release Date: {item.release_date}</p>
              <p>Rating: {item.rating}</p>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default MovieList;