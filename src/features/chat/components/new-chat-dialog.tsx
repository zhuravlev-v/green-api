import { useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

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

  if (!open) {
    return null;
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-chat-title"
        className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 id="new-chat-title" className="text-lg font-semibold">
              Новый чат
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Введите номер в международном формате
            </p>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={close} aria-label="Закрыть">
            <X />
          </Button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Input
            autoFocus
            inputMode="tel"
            autoComplete="tel"
            placeholder="+79991234567"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            aria-invalid={Boolean(error)}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={close} disabled={createChat.isPending}>
              Отмена
            </Button>
            <Button type="submit" disabled={createChat.isPending}>
              {createChat.isPending ? 'Проверяем…' : 'Создать чат'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
