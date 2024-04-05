import { useContext, useCallback, useEffect, useState } from "react";
import { SocketContext } from "@app/context/SocketProvider";
import { User, useUserStore } from "@app/store";

enum CallActions {
  InitiateCall = "initiateCall",
  IncomingCall = "incomingCall",
  RejectCall = "rejectCall",
  RejectCallIncoming = "rejectCallIncoming",
  CallRejected = "callRejected",
  CallRejectedIncoming = "callRejectedIncoming",
}

export interface Call {
  // Объект пользователя, инициирующего звонок.
  // Содержит информацию о пользователе, который совершает вызов.
  caller: User;

  // Объект пользователя, которому предназначен звонок.
  // Содержит информацию о пользователе, который должен принять или отклонить звонок.
  receiver: User;
}

export const useCall = () => {
  const socket = useContext(SocketContext);
  const { user, setReceiver } = useUserStore(({ user, setReceiver }) => ({
    user,
    setReceiver,
  })); // Текущий пользователь
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

  // Отклонить звонок
  const rejectCall = useCallback(
    (call: Call) => {
      if (!socket) return;
      socket.emit(CallActions.RejectCall, call);
    },
    [socket],
  );

  const rejectCallIncoming = useCallback(
    (call: Call) => {
      if (!socket) return;
      socket.emit(CallActions.RejectCallIncoming, call);
    },
    [socket],
  );

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

  useEffect(() => {
    if (!socket) return;

    const handleCallRejected = () => {
      setIncomingCall(null);
    };

    socket.on(CallActions.CallRejected, handleCallRejected);

    return () => {
      socket.off(CallActions.CallRejected, handleCallRejected);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleCallRejectedIncoming = () => {
      setReceiver(null);
    };

    socket.on(CallActions.CallRejectedIncoming, handleCallRejectedIncoming);

    return () => {
      socket.off(CallActions.CallRejectedIncoming, handleCallRejectedIncoming);
    };
  }, [socket]);

  return { initiateCall, incomingCall, rejectCall, rejectCallIncoming };
};
