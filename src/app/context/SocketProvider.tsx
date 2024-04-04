import { createContext, FC, PropsWithChildren, useEffect } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
const socket = io(SOCKET_URL);
export const SocketContext = createContext<Socket>(socket);

export const SocketProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
