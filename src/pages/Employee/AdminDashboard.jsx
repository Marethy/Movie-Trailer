import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Input, Button, Spin, message } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  ShoppingOutlined,
  ShopOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { getAccessToken, getUser2, getMovies,getUser } from '../../api/apiService';
import MovieList from '../../components/movie/MovieList';
import useFetchMovies from '../../hooks/useFetchMovies';
import UserDetail from '../../components/user/UserDetail';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const { trendingMovies, topRatedMovies, isLoading: isLoadingMovies } = useFetchMovies();

  useEffect(() => {
    const fetchData = async () => {
      await getAccessToken();

      try {
        const userData = await getUser2(1);
        console.log('Fetched user data:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        message.error('Failed to load user data');
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchMovies = async () => {
      try {
        const movieData = await getMovies();
        console.log('Fetched movie data:', movieData);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        message.error('Failed to load movie data');
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchData();
    fetchMovies();
  }, []);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => setSelectedMenuItem('1')}>Home</Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />} onClick={() => setSelectedMenuItem('2')}>Employee</Menu.Item>
          <Menu.Item key="3" icon={<VideoCameraOutlined />} onClick={() => setSelectedMenuItem('3')}>Movies</Menu.Item>
          <Menu.Item key="4" icon={<ShoppingOutlined />} onClick={() => setSelectedMenuItem('4')}>Products</Menu.Item>
          <Menu.Item key="5" icon={<ShopOutlined />} onClick={() => setSelectedMenuItem('5')}>Theaters</Menu.Item>
          <Menu.Item key="6" icon={<DollarOutlined />} onClick={() => setSelectedMenuItem('6')}>Receipts</Menu.Item>
          <Menu.Item key="7" icon={<PieChartOutlined />} onClick={() => setSelectedMenuItem('7')}>Dashboard</Menu.Item>
          <Menu.Item key="8" icon={<DesktopOutlined />} onClick={() => setSelectedMenuItem('8')}>Option 2</Menu.Item>
          <SubMenu key="sub1" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="9" onClick={() => setSelectedMenuItem('9')}>Team 1</Menu.Item>
            <Menu.Item key="10" onClick={() => setSelectedMenuItem('10')}>Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="11" icon={<FileOutlined />} onClick={() => setSelectedMenuItem('11')}>Files</Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>
              {selectedMenuItem === '3' ? 'Movies' : selectedMenuItem === '2' ? 'Employee' : 'Home'}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {/* Display User Detail when Employee is selected */}
            {selectedMenuItem === '2' && (
              loadingUser ? (
                <Spin tip="Loading user data..." />
              ) : (
                <UserDetail user={user} />
              )
            )}

            {/* Display Movie List when Movies is selected */}
            {selectedMenuItem === '3' && (
              <>
                <div style={{ margin: '16px 0' }}>
                  <Search placeholder="Search for movies..." style={{ width: 200 }} />
                  <Button type="primary" style={{ marginLeft: '10px' }}>Filter by Date</Button>
                </div>
                {loadingMovies || isLoadingMovies ? (
                  <Spin tip="Loading movies..." />
                ) : (
                  <MovieList title="Trending Movies" data={trendingMovies} />
                )}
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