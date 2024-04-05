import { useState, useEffect, useCallback, FC, useMemo } from "react";
import { Modal, Button } from "antd";
import { useCall } from "@hooks/useCall";
import { PhoneOutlined } from "@ant-design/icons";
import styles from "./IncomingCallModal.module.scss";

interface CallComponentProps {}

// Устанавливаем таймаут для автоматического сброса звонка в миллисекундах
const CALL_TIMEOUT = 30000;

/**
 * Компонент отображает модальное окно для входящего звонка.
 */
export const IncomingCallModal: FC<CallComponentProps> = () => {
  const { incomingCall, rejectCallIncoming } = useCall();

  // Состояние видимости модального окна
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
    setIsOpen(false);
    stopRinging();

    console.log("Звонок отклонен");

    incomingCall && rejectCallIncoming(incomingCall);
  }, [incomingCall, rejectCallIncoming, stopRinging]);

  // Принятие звонка (пока не реализовано)
  const handleAccept = useCallback(() => {
    console.log("Звонок принят.");
    handleReject(); // Пока что просто закрываем модальное окно
  }, [handleReject]);

  useEffect(() => {
    if (incomingCall) {
      setIsOpen(true);
      startRinging();

      const timeout = setTimeout(() => {
        console.log("Звонок автоматически пропущен после таймаута.");
        handleReject();
      }, CALL_TIMEOUT);

      return () => clearTimeout(timeout);
    } else {
      handleReject();
    }
  }, [handleReject, startRinging, incomingCall]);

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
