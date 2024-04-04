import { useState, useEffect, useCallback, FC, useMemo } from "react";
import { Modal, Button } from "antd";
import { Call } from "@hooks/useCall.tsx";

interface CallComponentProps {
  call: Call | null;
}

// таймаута для автоматического сброса звонка
const CALL_TIMEOUT = 5000;

const CallComponent: FC<CallComponentProps> = ({ call }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Инициализация и настройка аудио объекта
  const audio = useMemo(() => {
    const audio = new Audio("/audio/bell.mp3");
    audio.loop = true; // Включаем повторение аудио
    return audio;
  }, []);

  /**
   * Запуск воспроизведения звукового сигнала звонка.
   */
  const startRinging = useCallback(() => {
    audio
      .play()
      .catch((error) => console.error("Ошибка воспроизведения аудио:", error));
  }, [audio]);

  /**
   * Остановка воспроизведения звукового сигнала и сброс текущего времени воспроизведения.
   */
  const stopRinging = useCallback(() => {
    audio.pause();
    audio.currentTime = 0; // Сбросить время воспроизведения на начало
  }, [audio]);

  /**
   * Закрытие модального окна, остановка звонка и очистка таймера.
   */
  const handleClose = useCallback(() => {
    setIsModalVisible(false);
    stopRinging();
    if (timer) clearTimeout(timer);
  }, [timer, stopRinging]);

  /**
   * Обработка события открытия модального окна и запуск звонка.
   */
  const handleOpen = useCallback(() => {
    setIsModalVisible(true);
    startRinging();
    const timeout = setTimeout(() => {
      console.log("Звонок пропущен");
      handleClose();
    }, CALL_TIMEOUT);
    setTimer(timeout);
  }, [handleClose, startRinging]);

  const handleAccept = useCallback(() => {
    console.log("Взяли трубку");
    handleClose();
  }, [handleClose]);

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

export default CallComponent;
