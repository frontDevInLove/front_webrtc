import { useContext, useCallback, useEffect, useState } from "react";
import { SocketContext } from "@app/context/SocketProvider";
import { User, useUserStore } from "@app/store";

// Интерфейс описывает структуру звонка.
export interface Call {
  caller: User; // Инициатор звонка.
  receiver: User; // Получатель звонка.
}

// Перечисление действий, инициируемых клиентом.
enum ClientCallActions {
  InitiateCall = "initiateCall",
  RejectCallOutgoing = "rejectCallOutgoing",
  RejectCallIncoming = "rejectCallIncoming",
}

// Перечисление действий, инициируемых сервером.
enum ServerCallActions {
  IncomingCall = "incomingCall",
  CallRejectedOutgoing = "callRejectedOutgoing",
  CallRejectedIncoming = "callRejectedIncoming",
}

// Хук useCall предоставляет методы и состояние для управления звонками.
export const useCall = () => {
  const socket = useContext(SocketContext);

  const { user, setReceiver, receiver } = useUserStore(
    ({ user, setReceiver, receiver }) => ({
      user,
      setReceiver,
      receiver,
    }),
  );

  // Текущий входящий звонок
  const [incomingCall, setIncomingCall] = useState<Call | null>(null);

  // Инициирует звонок другому пользователю.
  const initiateCall = useCallback(
    (receiver: User) => {
      if (!socket || !user) return;
      console.log(`${user.username} звонит ${receiver.username}`);

      const newCall: Call = {
        caller: user,
        receiver,
      };

      socket.emit(ClientCallActions.InitiateCall, newCall);
    },
    [socket, user],
  );

  // Отклоняет исходящий звонок.
  const rejectCallOutgoing = useCallback(
    (call: Call) => {
      if (!socket) return;
      console.log(
        `${call.caller.username} отклонил свой звонок ${call.receiver.username}`,
      );
      socket.emit(ClientCallActions.RejectCallOutgoing, call);
    },
    [socket],
  );

  // Отклоняет входящий звонок.
  const rejectCallIncoming = useCallback(
    (call: Call) => {
      if (!socket) return;
      console.log(
        `${call.receiver.username} не принял входящий звонок от ${call.caller.username}`,
      );
      socket.emit(ClientCallActions.RejectCallIncoming, call);
    },
    [socket],
  );

  // Слушатели для обработки событий звонков от сервера
  useEffect(() => {
    if (!socket) return;

    // Обработка входящего звонка.
    const handleIncomingCall = (call: Call) => {
      console.log(` ${call.caller.username} звонит ${call.receiver.username}`);
      setIncomingCall(call); // Установка состояния входящего звонка.
    };

    // Обработка событий отклонения звонка.
    const handleCallRejected = (action: ServerCallActions) => () => {
      if (action === ServerCallActions.CallRejectedOutgoing) {
        console.log(`Исходящий звонок отклонент`, incomingCall);
        setIncomingCall(null);
      } else if (action === ServerCallActions.CallRejectedIncoming) {
        console.log(`Входящий звонок отклонент`, receiver);
        setReceiver(null);
      }
    };

    socket.on(ServerCallActions.IncomingCall, handleIncomingCall);
    socket.on(
      ServerCallActions.CallRejectedOutgoing,
      handleCallRejected(ServerCallActions.CallRejectedOutgoing),
    );
    socket.on(
      ServerCallActions.CallRejectedIncoming,
      handleCallRejected(ServerCallActions.CallRejectedIncoming),
    );

    // Очищаем подписки на события при размонтировании компонента.
    return () => {
      socket.off(ServerCallActions.IncomingCall, handleIncomingCall);
      socket.off(
        ServerCallActions.CallRejectedOutgoing,
        handleCallRejected(ServerCallActions.CallRejectedOutgoing),
      );
      socket.off(
        ServerCallActions.CallRejectedIncoming,
        handleCallRejected(ServerCallActions.CallRejectedIncoming),
      );
    };
  }, [socket, setReceiver, incomingCall, receiver]);

  return { initiateCall, incomingCall, rejectCallOutgoing, rejectCallIncoming };
};

// // Принять звонок
// const acceptCall = useCallback(
//   (callId: string) => {
//     if (!socket) return;
//     socket.emit(CallActions.AcceptCall, callId);
//   },
//   [socket],
// );