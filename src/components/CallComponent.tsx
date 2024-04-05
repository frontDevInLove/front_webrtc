import { useState, useEffect, useCallback, FC, useMemo } from "react";
import { Modal, Button } from "antd";
import { Call } from "@hooks/useCall";

interface CallComponentProps {
  call: Call | null;
}

// Задаём таймаут для автоматического сброса входящего звонка
const CALL_TIMEOUT = 5000;

export const CallComponent: FC<CallComponentProps> = ({ call }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Инициализируем аудио объект для воспроизведения звонка
  const audio = useMemo(() => {
    const audio = new Audio("/audio/bell.mp3");
    audio.loop = true; // Настройка аудио для циклического воспроизведения

    return audio;
  }, []);

  // Функция для начала воспроизведения звонка
  const startRinging = useCallback(() => {
    audio
      .play()
      .catch((error) => console.error("Ошибка воспроизведения аудио:", error));
  }, [audio]);

  // Функция для остановки воспроизведения звонка
  const stopRinging = useCallback(() => {
    audio.pause();
    audio.currentTime = 0; // Сбрасываем аудио на начало
  }, [audio]);

  // Обработка закрытия модального окна
  const handleClose = useCallback(() => {
    setIsModalVisible(false);
    stopRinging();
    if (timer) clearTimeout(timer);
  }, [timer, stopRinging]);

  // Автоматический сброс звонка после заданного таймаута
  const handleOpen = useCallback(() => {
    setIsModalVisible(true);
    startRinging();

    const timeout = setTimeout(() => {
      console.log("Звонок пропущен");
      handleClose();
    }, CALL_TIMEOUT);

    setTimer(timeout);
  }, [handleClose, startRinging]);

  // Функция обработки принятия звонка ToDo - надо дописать
  const handleAccept = useCallback(() => {
    console.log("Взяли трубку");
    handleClose();
  }, [handleClose]);

  // Функция обработки отклонения звонка
  const handleReject = useCallback(() => {
    console.log("Звонок отклонен");
    handleClose();
  }, [handleClose]);

  useEffect(() => {
    // Очистка таймера при размонтировании компонента
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  useEffect(() => {
    if (!call) return;

    handleOpen();
  }, [call]);

  useEffect(() => {
    return () => {
      stopRinging();
    };
  }, []);

  return (
    <div>
      <Modal
        title="Входящий звонок"
        open={isModalVisible}
        closable={false}
        footer={[
          <Button key="reject" onClick={handleReject}>
            Отклонить
          </Button>,
          <Button key="accept" type="primary" onClick={handleAccept}>
            Принять
          </Button>,
        ]}
      >
        <p>Звонок от пользователя: {call?.caller.username}</p>
      </Modal>
    </div>
  );
};
