import { FC, memo } from "react";
import { IncomingCallModal } from "@components/IncomingCallModal/IncomingCallModal.tsx";
import { OutgoingCallDialog } from "@components/OutgoingCallDialog/OutgoingCallDialog";

interface CallModalManagerProps {}

/**
 * Компонент управления модальными окнами звонков.
 * Отображает модальные окна для входящих и исходящих звонков.
 */
export const CallModalManager: FC<CallModalManagerProps> = memo(() => {
  return (
    <>
      <IncomingCallModal />

      <OutgoingCallDialog />
    </>
  );
});
