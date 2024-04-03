import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io(SOCKET_URL);

interface User {
  id: string;
  username: string;
}

// Определение enum для действий
enum UserAction {
  AddUser = "addUser",
  RemoveUser = "removeUser",
  GetUsers = "getUsers",
  UsersList = "usersList",
}

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

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
      // ToDo - надо бы сохранить в стор
      console.log(newUser);
    });
  }, []);

  const removeUser = useCallback((userId: string) => {
    socket.emit(UserAction.RemoveUser, userId);
  }, []);

  return { users, addUser, removeUser };
};

export default useUsers;
