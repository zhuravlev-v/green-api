import { useEffect } from 'react';

import { useChats, useChatStore } from '@/entities/chat';
import { useInstanceSettings, useInstanceState, useInstanceStore } from '@/entities/instance';
import { ChatWorkspace, useNotificationsPolling } from '@/features/chat';
import { AppHeader } from '@/shared/components/header';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export default function HomePage() {
  const credentials = useInstanceStore((state) => state.credentials);
  const isAuth = useInstanceStore((state) => state.isAuth);
  const setChatOwner = useChatStore((state) => state.setOwner);
  const instanceState = useInstanceState(credentials.idInstance, isAuth);
  const settings = useInstanceSettings(credentials.idInstance, isAuth);
  const isAuthorized = instanceState.data?.stateInstance === 'authorized';
  const chats = useChats(credentials.idInstance, isAuthorized);
  const hasCompatibleSettings =
    settings.data?.webhookUrl === '' && settings.data.incomingWebhook === 'yes';
  const pollingStatus = useNotificationsPolling(isAuthorized && hasCompatibleSettings);

  useEffect(() => {
    if (credentials.idInstance) {
      setChatOwner(credentials.idInstance);
    }
  }, [credentials.idInstance, setChatOwner]);

  useEffect(() => {
    if (!chats.data) {
      return;
    }

    useChatStore.getState().syncChats(
      chats.data.map((chat) => {
        const chatId = chat.newChatId ?? chat.id;
        const phoneNumber = chat.id.endsWith('@c.us') ? chat.id.slice(0, -5) : '';

        return {
          chatId,
          aliases: [chat.id, ...(chat.newChatId ? [chat.newChatId] : [])],
          phoneNumber,
          name: chat.name || (phoneNumber ? `+${phoneNumber}` : chatId),
          unreadCount: chat.unreadCount,
        };
      }),
    );
  }, [chats.data]);

  const settingsProblem = settings.data
    ? settings.data.webhookUrl
      ? 'В инстансе задан Webhook URL. Для HTTP API поле webhookUrl должно быть пустым.'
      : settings.data.incomingWebhook !== 'yes'
        ? 'Включите настройку «Получать уведомления о входящих сообщениях и файлах».'
        : null
    : null;

  const renderContent = () => {
    if (instanceState.isPending || settings.isPending || (isAuthorized && chats.isPending)) {
      let loadingMessage = 'Проверяем настройки инстанса…';

      if (chats.isPending && isAuthorized) {
        loadingMessage = 'Загружаем чаты…';
      }

      return (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          {loadingMessage}
        </div>
      );
    }

    if (!isAuthorized) {
      return (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Инстанс WhatsApp не авторизован</CardTitle>
              <CardDescription>
                Авторизуйте инстанс в личном кабинете GREEN-API, затем войдите повторно.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    if (chats.isError) {
      return (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Не удалось загрузить чаты</CardTitle>
              <CardDescription>Проверьте подключение и повторите запрос.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" onClick={() => void chats.refetch()}>
                Повторить
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (settingsProblem || settings.isError) {
      return (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-xl border-amber-300">
            <CardHeader>
              <CardTitle>Настройте получение сообщений</CardTitle>
              <CardDescription>
                {settingsProblem ?? 'Не удалось проверить настройки инстанса.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                Откройте инстанс в личном кабинете GREEN-API, очистите Webhook URL, включите
                входящие уведомления и сохраните изменения.
              </p>
              <a
                className="font-medium text-primary underline underline-offset-4"
                href="https://console.green-api.com/"
                target="_blank"
                rel="noreferrer"
              >
                Открыть личный кабинет GREEN-API
              </a>
            </CardContent>
          </Card>
        </div>
      );
    }

    return <ChatWorkspace pollingStatus={pollingStatus} />;
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <AppHeader />
      {renderContent()}
    </div>
  );
}
