import { Layout, Menu, Typography } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import useUsers from "@hooks/useUsers";
import { User, useUserStore } from "@app/store";
import { FC, useCallback } from "react";

const { Sider } = Layout;
const { Title } = Typography;

interface SidebarProps {
  onInitiateCall: (receiver: User) => void; // Пропс для инициации звонка
}

export const Sidebar: FC<SidebarProps> = ({ onInitiateCall }) => {
  // Получаем список пользователей и текущего пользователя
  const { users } = useUsers();
  const currentUser = useUserStore((state) => state.user);

  // Функция обработки клика на элемент меню (пользователя), чтобы начать звонок
  const handleUserClick = useCallback(
    (receiver: User) => {
      onInitiateCall(receiver);
    },
    [onInitiateCall],
  );

  return (
    <Sider breakpoint="lg" collapsedWidth="0" theme="light">
      <Title level={4} style={{ padding: "16px" }}>
        Пользователи в сети
      </Title>
      <Menu theme="light" mode="inline">
        {currentUser &&
          users
            .filter(({ id }) => id !== currentUser.id)
            .map((user) => (
              <Menu.Item
                key={user.id}
                icon={<VideoCameraOutlined />}
                onClick={() => handleUserClick(user)}
              >
                {user.username}
              </Menu.Item>
            ))}
      </Menu>
    </Sider>
  );
};
