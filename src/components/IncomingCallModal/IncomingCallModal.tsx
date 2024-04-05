import { useState, useEffect, useCallback, FC, useMemo } from "react";
import { Modal, Button } from "antd";
import { useCall } from "@hooks/useCall.tsx";
import { PhoneOutlined } from "@ant-design/icons";
import styles from "./IncomingCallModal.module.scss";

interface CallComponentProps {}

// Задаём таймаут для автоматического сброса входящего звонка
const CALL_TIMEOUT = 30000;

/**
 * Компонент отображает модальное окно для входящего звонка.
 * @constructor
 */
export const IncomingCallModal: FC<CallComponentProps> = () => {
  const { incomingCall, rejectCallIncoming } = useCall();

  // Состояние видимости модального окна
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  // Функция обработки отклонения звонка
  const handleReject = useCallback(() => {
    if (!incomingCall) return;

    setIsOpen(false);
    stopRinging();
    if (timer) clearTimeout(timer);
    console.log("Звонок отклонен");

    rejectCallIncoming(incomingCall);
  }, [timer, stopRinging]);

  // Автоматический сброс звонка после заданного таймаута
  const handleOpen = useCallback(() => {
    setIsOpen(true);
    startRinging();

    const timeout = setTimeout(() => {
      console.log("Звонок пропущен");
      handleReject();
    }, CALL_TIMEOUT);

    setTimer(timeout);
  }, [handleReject, startRinging]);

  // Функция обработки принятия звонка ToDo - надо дописать
  const handleAccept = useCallback(() => {
    console.log("Взяли трубку");
    handleReject();
  }, [handleReject]);

  useEffect(() => {
    // Очистка таймера при размонтировании компонента
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  useEffect(() => {
    if (incomingCall) {
      handleOpen();
    } else {
      handleReject();
    }
  }, [incomingCall]);

  return (
    <Modal
      open={isOpen}
      closable={false}
      footer={null}
      centered
      wrapClassName={styles["incomingCall-component"]}
    >
      <p className={styles["incomingCall-component__income"]}>
        Входящий звонок
      </p>

      <p className={styles["incomingCall-component__text"]}>
        Звонок от пользователя: {incomingCall?.caller.username}
      </p>

      <div className={styles["incomingCall-component__buttons"]}>
        <Button
          shape="circle"
          icon={<PhoneOutlined />}
          size="large"
          onClick={handleAccept}
          className={`${styles["incomingCall-component__button"]} ${styles["incomingCall-component__button--accept"]}`}
        />
        <Button
          shape="circle"
          icon={<PhoneOutlined />}
          size="large"
          className={`${styles["incomingCall-component__button"]} ${styles["incomingCall-component__button--reject"]}`}
          onClick={handleReject}
        />
      </div>
    </Modal>
  );
};
