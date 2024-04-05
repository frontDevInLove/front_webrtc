import { Layout } from "antd";
import { useEffect, useState } from "react";
import { Sidebar } from "@widgets/Sidebar";
import useUsers from "@hooks/useUsers";
import MainContent from "@components/MainContent";
import UsernameModal from "@components/UsernameModal";
import { CallModalManager } from "@widgets/CallModalManager";
import { User } from "@app/store";

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addUser } = useUsers();
  const [receiver, setReceiver] = useState<User | null>(null);

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) return setIsModalOpen(true);

    addUser(username);
  }, [addUser]);

  const handleUsernameSubmit = (username: string) => {
    setIsModalOpen(false);
    localStorage.setItem("username", username);
    addUser(username);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sidebar onInitiateCall={setReceiver} />
      <MainContent />
      <UsernameModal open={isModalOpen} onSubmit={handleUsernameSubmit} />
      <CallModalManager
        receiver={receiver}
        onCancelled={() => setReceiver(null)}
      />
    </Layout>
  );
};

export default App;
