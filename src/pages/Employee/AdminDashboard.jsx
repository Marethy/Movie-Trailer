import React, { useEffect, useState } from "react";
import { Layout, Menu, Breadcrumb, Input, Button, Spin, message, Dropdown } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  VideoCameraOutlined,
  ShoppingOutlined,
  ShopOutlined,
  DollarOutlined,
  PieChartOutlined,
  DesktopOutlined,
  TeamOutlined,
  FileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import UserApi from "../../api/userApi";
import MovieApi from "../../api/movieApi";
import MovieList from "../../components/movie/MovieList";
import useFetchMovies from "../../hooks/useFetchMovies";
import UserDetail from "../../components/admin/UserDetail";
import TheaterManagement from "../../components/admin/TheaterManagement";
import { TokenManager } from "../../api/apiClient";
import {useNavigate} from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const UserProfileButton = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  const handleMenuClick = ({ key }) => {
    if (key === "profile") {
      message.info("Redirecting to profile...");
    } else if (key === "logout") {
      localStorage.removeItem("username");
      message.success("Logged out successfully.");
      navigate("/login");
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Your Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Log Out
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <UserOutlined style={{ color: "white", fontSize: "24px", paddingRight: "10px" }} />
        <p style={{ color: "white", margin: "0 10px" }}>Hello, {username}</p>
      </div>
    </Dropdown>
  );
};

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("1");
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const { trendingMovies, topRatedMovies, isLoading: isLoadingMovies } = useFetchMovies();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        await TokenManager.getAccessToken();
        const userData = await UserApi.getUser(1);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        message.error("Failed to load user data");
      } finally {
        setLoadingUser(false);
      }
    };

    const fetchMovies = async () => {
      try {
        await TokenManager.getAccessToken();
        const movieData = await MovieApi.getMovies();
      } catch (error) {
        console.error("Error fetching movie data:", error);
        message.error("Failed to load movie data");
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchData();
    fetchMovies();
  }, []);

  const onCollapse = (collapsed) => setCollapsed(collapsed);

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Home" },
    { key: "2", icon: <UserOutlined />, label: "Employee" },
    { key: "3", icon: <VideoCameraOutlined />, label: "Movies" },
    { key: "4", icon: <ShoppingOutlined />, label: "Products" },
    { key: "5", icon: <ShopOutlined />, label: "Theaters" },
    { key: "6", icon: <DollarOutlined />, label: "Receipts" },
    { key: "7", icon: <PieChartOutlined />, label: "Dashboard" },
    { key: "8", icon: <DesktopOutlined />, label: "Option 2" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon} onClick={() => setSelectedMenuItem(item.key)}>
              {item.label}
            </Menu.Item>
          ))}
          <SubMenu key="sub1" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="9">Team 1</Menu.Item>
            <Menu.Item key="10">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="11" icon={<FileOutlined />}>Files</Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          <UserProfileButton />
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item>{selectedMenuItem === "3" ? "Movies" : selectedMenuItem === "2" ? "Employee" : "Home"}</Breadcrumb.Item>
          </Breadcrumb>

          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            {selectedMenuItem === "2" && (loadingUser ? <Spin tip="Loading user data..." /> : <UserDetail user={user} />)}
            {selectedMenuItem === "3" && (
              <>
                <div style={{ margin: "16px 0" }}>
                  <Search placeholder="Search for movies..." style={{ width: 200 }} />
                  <Button type="primary" style={{ marginLeft: "10px" }}>Filter by Date</Button>
                </div>
                {loadingMovies || isLoadingMovies ? <Spin tip="Loading movies..." /> : <MovieList title="Trending Movies" data={trendingMovies} />}
              </>
            )}
            {selectedMenuItem === "5" && <TheaterManagement />}
          </div>
        </Content>
        
        <Footer style={{ textAlign: "center" }}>Ticket Booking ©2024 Created by Khiem and Khanh</Footer>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
