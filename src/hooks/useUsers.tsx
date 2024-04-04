import { useCallback, useContext, useEffect, useState } from "react";
import { User, useUserStore } from "@app/store";
import { SocketContext } from "@app/context/SocketProvider";

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
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        socket.emit(UserAction.GetUsers);
      });

      socket.on(UserAction.UsersList, (users: User[]) => {
        setUsers(users);
      });

      return () => {
        socket.off("connect");
        socket.off(UserAction.UsersList);
      };
    }
  }, [socket]); // Добавьте socket в список зависимостей

  const addUser = useCallback(
    (username: string) => {
      socket.emit(UserAction.AddUser, username, (newUser: User) => {
        setUser(newUser);
      });
    },
    [socket], // Добавьте socket в список зависимостей
  );

  const removeUser = useCallback(
    (userId: string) => {
      socket.emit(UserAction.RemoveUser, userId);
    },
    [socket], // Добавьте socket в список зависимостей
  );

  return { users, addUser, removeUser };
};

export default useUsers;
