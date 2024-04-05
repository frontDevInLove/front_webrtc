import { FC, useEffect, useState } from "react";
import { Modal, Button } from "antd";
import { useUserStore } from "@app/store";
import { PhoneOutlined } from "@ant-design/icons";
import styles from "./OutgoingCallDialog.module.scss";
import { Call, useCall } from "@hooks/useCall.tsx";

interface OutgoingCallDialogProps {}

/**
 * Компонент отображает модальное окно для исходящего звонка.
 */
export const OutgoingCallDialog: FC<OutgoingCallDialogProps> = () => {
  const { receiver, user, setReceiver } = useUserStore(
    ({ receiver, setReceiver, user }) => ({ receiver, setReceiver, user }),
  );

  // Состояние видимости модального окна
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { rejectCall, initiateCall } = useCall();

  // Показываем или скрываем модальное окно в зависимости от наличия получателя звонка
  useEffect(() => {
    if (!receiver) return setIsOpen(false);

    initiateCall(receiver.id);
    setIsOpen(true);
  }, [receiver]);

  // Обработчик нажатия на кнопку "Сбросить" - отклонение исходящего звонка
  const handleReject = () => {
    if (!user || !receiver) return;

    const call: Call = {
      receiver: receiver,
      caller: user,
    };

    rejectCall(call); // Отправка сигнала об отклонении звонка
    setReceiver(null); // Сброс выбранного получателя в сторе
  };

  return (
    <Modal
      open={isOpen}
      footer={null}
      closable={false}
      className={styles.dialog}
    >
      <div className={styles.dialogContent}>
        <p className={styles.username}>
          Звонок пользователю: {receiver?.username}
        </p>
        <Button
          type="primary"
          shape="circle"
          icon={<PhoneOutlined />}
          size="large"
          danger
          onClick={handleReject}
          className={styles.rejectCallButton}
        />
      </div>
    </Modal>
  );
};
