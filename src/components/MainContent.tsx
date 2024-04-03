import { Layout, Typography } from "antd";

const { Content } = Layout;
const { Title } = Typography;

const MainContent = () => (
  <Content style={{ padding: "10px 16px", minHeight: 280 }}>
    <Title>Ваш видеопоток</Title>
    {/* Здесь будет интегрирован видеопоток пользователя */}
  </Content>
);

export default MainContent;
