import { Layout, Typography } from "antd";
import { useEffect, useState } from "react";
import UsernameModal from "./components/UsernameModal";
import Sidebar from "@widgets/Sidebar";
import useUsers from "@hooks/useUsers.tsx";

const { Content } = Layout;
const { Title } = Typography;

/**
 * ToDO - Вынести в отдельный компонент
 * Компонент для основного содержимого
 */
const MainContent = () => (
  <Content style={{ padding: "10px 16px", minHeight: 280 }}>
    <Title>Ваш видеопоток</Title>
    {/* Здесь будет интегрирован видеопоток пользователя */}
  </Content>
);

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addUser } = useUsers();

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) return setIsModalOpen(true);

    addUser(username);
  }, []);

  const handleUsernameSubmit = (username: string) => {
    setIsModalOpen(false);
    localStorage.setItem("username", username);
    addUser(username);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar />
      <MainContent />
      <UsernameModal open={isModalOpen} onSubmit={handleUsernameSubmit} />
    </Layout>
  );
};

export default App;
