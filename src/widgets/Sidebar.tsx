import { Layout, Menu, Typography } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import useUsers from "@hooks/useUsers";

const { Sider } = Layout;
const { Title } = Typography;
/**
 * Компонент для боковой панели приложения
 */
const Sidebar = () => {
  const { users } = useUsers();

  return (
    <Sider breakpoint="lg" collapsedWidth="0" theme="light">
      <Title level={4} style={{ padding: "16px" }}>
        Пользователи
      </Title>
      <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
        {users.map((user) => (
          <Menu.Item key={user.id} icon={<VideoCameraOutlined />}>
            {user.username}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
