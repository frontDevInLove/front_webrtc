import { FC } from "react";
import { Modal, Button } from "antd";
import { User } from "@app/store";
import { PhoneOutlined } from "@ant-design/icons";
import styles from "./OutgoingCallDialog.module.scss";

interface OutgoingCallDialogProps {
  receiver: User;
  isOpen: boolean;
  onReject: () => void; // Функция, вызываемая при отклонении звонка
}

export const OutgoingCallDialog: FC<OutgoingCallDialogProps> = ({
  receiver,
  isOpen,
  onReject,
}) => {
  // Функция для обработки нажатия на кнопку "Сбросить"
  const handleReject = () => {
    onReject(); // Вызов переданной функции для обработки события отклонения звонка
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
          Звонок пользователю: {receiver.username}
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
