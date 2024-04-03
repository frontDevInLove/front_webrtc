import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import { User, useUserStore } from "@app/store";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io(SOCKET_URL);

// Определение enum для действий
enum UserAction {
  AddUser = "addUser",
  RemoveUser = "removeUser",
  GetUsers = "getUsers",
  UsersList = "usersList",
}

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit(UserAction.GetUsers);
    });

    socket.on(UserAction.UsersList, (users) => {
      setUsers(users);
    });

    return () => {
      socket.off("connect");
      socket.off(UserAction.UsersList);
    };
  }, []);

  const addUser = useCallback((username: string) => {
    socket.emit(UserAction.AddUser, username, (newUser: User) => {
      setUser(newUser);
    });
  }, []);

  const removeUser = useCallback((userId: string) => {
    socket.emit(UserAction.RemoveUser, userId);
  }, []);

  return { users, addUser, removeUser };
};

export default useUsers;
