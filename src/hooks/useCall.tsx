import { useContext, useCallback, useEffect, useState } from "react";
import { SocketContext } from "@app/context/SocketProvider";
import { User, useUserStore } from "@app/store";

enum CallActions {
  InitiateCall = "initiateCall",
  IncomingCall = "incomingCall",
}

export interface Call {
  caller: User;
  receiver: User;
}

export const useCall = () => {
  const socket = useContext(SocketContext);
  const user = useUserStore((state) => state.user); // Текущий пользователь
  const [incomingCall, setIncomingCall] = useState<Call | null>(null);

  // Инициировать звонок
  const initiateCall = useCallback(
    (receiverId: string) => {
      if (!socket || !user) return;
      const callerId = user.id;

      socket.emit(CallActions.InitiateCall, callerId, receiverId);
    },
    [socket, user],
  );

  // // Принять звонок
  // const acceptCall = useCallback(
  //   (callId: string) => {
  //     if (!socket) return;
  //     socket.emit(CallActions.AcceptCall, callId);
  //   },
  //   [socket],
  // );
  //
  // // Отклонить звонок
  // const rejectCall = useCallback(
  //   (callId: string) => {
  //     if (!socket) return;
  //     socket.emit(CallActions.RejectCall, callId);
  //   },
  //   [socket],
  // );

  // Слушать входящие звонки и другие события звонка
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (call: Call) => {
      setIncomingCall(call);
    };

    socket.on(CallActions.IncomingCall, handleIncomingCall);

    return () => {
      socket.off(CallActions.IncomingCall, handleIncomingCall);
    };
  }, [socket]);

  return { initiateCall, incomingCall };
};
