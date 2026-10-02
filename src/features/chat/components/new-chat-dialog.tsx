import { useState } from 'react';

import { NewChatDialogView } from '@/shared/components/chat-workspace';

import { useCreateChat } from '../hooks/use-create-chat';
import { phoneNumberSchema } from '../model/phone';

type NewChatDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function NewChatDialog({ open, onClose }: NewChatDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const createChat = useCreateChat();
  const resetCreateChat = createChat.reset;

  const close = () => {
    setPhoneNumber('');
    setError(null);
    resetCreateChat();
    onClose();
  };

  const submit = async () => {
    setError(null);

    const parsedPhone = phoneNumberSchema.safeParse(phoneNumber);

    if (!parsedPhone.success) {
      setError(parsedPhone.error.issues[0]?.message ?? 'Введите корректный номер');
      return;
    }

    try {
      const result = await createChat.mutateAsync(parsedPhone.data);

      if (!result.existsWhatsapp) {
        setError('На этом номере нет аккаунта WhatsApp');
        return;
      }

      close();
    } catch {
      return;
    }
  };

  return (
    <NewChatDialogView
      open={open}
      phoneNumber={phoneNumber}
      error={error}
      isPending={createChat.isPending}
      onPhoneNumberChange={setPhoneNumber}
      onClose={close}
      onSubmit={submit}
    />
  );
}
