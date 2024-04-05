import { FC, memo, useCallback, useEffect, useState } from "react";
import { Call, useCall } from "@hooks/useCall";
import { CallComponent } from "@components/CallComponent";
import { OutgoingCallDialog } from "@components/OutgoingCallDialog/OutgoingCallDialog";
import { User, useUserStore } from "@app/store";

interface CallModalManagerProps {
  // Получатель звонка
  receiver: User | null;
  // Функция, вызываемая при отмене звонка
  onCancelled: () => void;
}

/**
 * Компонент управления модальными окнами звонков.
 * Отображает модальные окна для входящих и исходящих звонков.
 */
export const CallModalManager: FC<CallModalManagerProps> = memo(
  ({ receiver, onCancelled }) => {
    // Текущий пользователь из глобального состояния
    const user = useUserStore((state) => state.user);

    const [isOutgoingCallModalOpen, setIsOutgoingCallModalOpen] =
      useState(false);
    const { initiateCall, incomingCall, rejectCall } = useCall();

    // Инициирование исходящего звонка при изменении получателя
    useEffect(() => {
      if (!receiver) return;

      initiateCall(receiver.id); // Инициируем исходящий звонок
      setIsOutgoingCallModalOpen(true); // Открываем модальное окно исходящего звонка
    }, [receiver, initiateCall]);

    // Обработчик отклонения исходящего звонка
    const handleRejectCall = useCallback(() => {
      setIsOutgoingCallModalOpen(false); // Закрываем модальное окно
      onCancelled(); // Вызываем функцию, переданную в пропсах, для дополнительных действий при отмене

      if (!user || !receiver) return; // Если пользователь или получатель не найдены, выходим из функции

      const call: Call = {
        receiver: receiver,
        caller: user,
      };

      rejectCall(call); // Отправляем информацию о отклонении звонка
    }, [receiver, user, onCancelled, rejectCall]);

    return (
      <>
        {incomingCall && <CallComponent call={incomingCall} />}

        {receiver && (
          <OutgoingCallDialog
            receiver={receiver}
            isOpen={isOutgoingCallModalOpen}
            onReject={handleRejectCall}
          />
        )}
      </>
    );
  },
);
