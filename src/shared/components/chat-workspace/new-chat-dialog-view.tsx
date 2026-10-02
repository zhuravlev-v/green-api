import type { SyntheticEvent } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

type NewChatDialogViewProps = {
  open: boolean;
  phoneNumber: string;
  error: string | null;
  isPending: boolean;
  onPhoneNumberChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function NewChatDialogView({
  open,
  phoneNumber,
  error,
  isPending,
  onPhoneNumberChange,
  onClose,
  onSubmit,
}: NewChatDialogViewProps) {
  if (!open) {
    return null;
  }

  const submit = (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    onSubmit();
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isPending}
            aria-label="Закрыть"
          >
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
            onChange={(event) => onPhoneNumberChange(event.target.value)}
            disabled={isPending}
            aria-invalid={Boolean(error)}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Проверяем…' : 'Создать чат'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
