import { Layout, Menu, Typography } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
import useUsers from "@hooks/useUsers";
import { User, useUserStore } from "@app/store";
import CallComponent from "@components/CallComponent";
import { useCallback, useEffect, useState } from "react";
import { useCall } from "@hooks/useCall.tsx";
import { OutgoingCallDialog } from "@components/OutgoingCallDialog/OutgoingCallDialog.tsx";

const { Sider } = Layout;
const { Title } = Typography;
/**
 * Компонент для боковой панели приложения
 */
const Sidebar = () => {
  const [receiver, setReceiver] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Список пользователей в сети
  const { users } = useUsers();

  // Текущий пользователь
  const user = useUserStore((state) => state.user);

  // Инициировать звонок и отправить звонок на другого пользователя
  const { initiateCall, incomingCall } = useCall();

  // Инициировать звонок и отправить звонок на другого пользователя
  const initiateCallHandler = useCallback(
    (user: User) => {
      initiateCall(user.id);
      setReceiver(user);
      setIsDialogOpen(true);
    },
    [initiateCall, receiver],
  );

  const handleRejectCall = useCallback(() => {
    setIsDialogOpen(false); // Закрываем модальное окно при отклонении звонка
  }, []);

  useEffect(() => {
    // Пропускаем первый сигнал, поскольку он является инициализацией
    if (!incomingCall) return;
  }, [incomingCall]);

  return (
    <Sider breakpoint="lg" collapsedWidth="0" theme="light">
      <Title level={4} style={{ padding: "16px" }}>
        Пользователи в сети
      </Title>
      <Menu theme="light" mode="inline" defaultSelectedKeys={["1"]}>
        {user &&
          users
            .filter(({ id }) => id !== user.id)
            .map((user) => (
              <Menu.Item
                key={user.id}
                icon={<VideoCameraOutlined />}
                onClick={() => initiateCallHandler(user)}
              >
                {user.username}
              </Menu.Item>
            ))}
      </Menu>

      <CallComponent call={incomingCall} />

      {receiver && (
        <OutgoingCallDialog
          user={receiver}
          isOpen={isDialogOpen}
          onReject={handleRejectCall}
        />
      )}
    </Sider>
  );
};

export default Sidebar;
