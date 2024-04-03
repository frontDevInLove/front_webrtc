import { FC } from "react";
import { Modal, Input, Form } from "antd";

/**
 * Props для UsernameModal.
 * @property {boolean} open - Состояние видимости модального окна.
 * @property {(username: string) => void} onSubmit - Функция, вызываемая при подтверждении.
 */
interface UsernameModalProps {
  open: boolean;
  onSubmit: (username: string) => void;
}

// Определение типа для значений формы
interface UsernameFormValues {
  username: string;
}

/**
 * Модальное окно для ввода имени пользователя.
 */
const UsernameModal: FC<UsernameModalProps> = ({ open, onSubmit }) => {
  const [form] = Form.useForm<UsernameFormValues>();
  const initialValues = { username: "" };

  const handleOk = () => {
    form
      .validateFields()
      .then(({ username }) => {
        form.resetFields();
        onSubmit(username);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <Modal
      title="Введите ваше имя"
      open={open}
      closable={false}
      onOk={handleOk}
      okText="Подтвердить"
      cancelButtonProps={{ style: { display: "none" } }} // Скрываем кнопку отмены
    >
      <Form
        form={form}
        name="usernameForm"
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Пожалуйста, введите ваше имя!" }]}
        >
          <Input placeholder="Имя пользователя" onPressEnter={handleOk} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UsernameModal;
