import React, { useEffect, useState } from 'react';
import { Layout, Spin, message, Input, Button } from 'antd';
import UserApi from '../../api/userApi';
import MovieApi from '../../api/movieApi';
import ShowtimeApi from '../../api/showtimeApi';
import ProjectionRoomApi from '../../api/projectionRoomApi';
import TheaterApi from '../../api/theaterApi';
import MessageApi from '../../api/messageApi';
import RedisApi from '../../api/redisApi';
import SidebarMenu from '../../components/admin/SidebarMenu';
import BreadcrumbNav from '../../components/admin/BreadcrumbNav';
import UserDetail from '../../components/admin/UserDetail';
import MovieList from '../../components/admin/MovieList';
import ShowtimeList from '../../components/admin/ShowtimeList';
import ProjectionRoomList from '../../components/admin/ProjectionRoomList';
import TheaterList from '../../components/admin/TheaterList';
import MessageList from '../../components/admin/MessageList';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [projectionRooms, setProjectionRooms] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await UserApi.getUser(1);
        setUser(userData);

        const movieData = await MovieApi.getMovies();
        setMovies(movieData);

        const showtimeData = await ShowtimeApi.getShowtimesByMovieId(1); // Example movie ID
        setShowtimes(showtimeData);

        const projectionRoomData = await ProjectionRoomApi.getAllRoomByMovieID(1); // Example movie ID
        setProjectionRooms(projectionRoomData);

        const theaterData = await TheaterApi.getTheaters();
        setTheaters(theaterData);

        const messageData = await MessageApi.getMessage();
        setMessages(messageData);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <SidebarMenu selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <BreadcrumbNav selectedMenuItem={selectedMenuItem} />
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {loading ? (
              <Spin tip="Loading data..." />
            ) : (
              <>
                {selectedMenuItem === '1' && <UserDetail user={user} />}
                {selectedMenuItem === '2' && <MovieList movies={movies} />}
                {selectedMenuItem === '3' && <ShowtimeList showtimes={showtimes} />}
                {selectedMenuItem === '4' && <ProjectionRoomList projectionRooms={projectionRooms} />}
                {selectedMenuItem === '5' && <TheaterList theaters={theaters} />}
                {selectedMenuItem === '6' && <MessageList messages={messages} />}
              </>
            )}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;