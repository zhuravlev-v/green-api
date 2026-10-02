# GREEN-API WhatsApp Chat

Frontend SPA для отправки и получения личных текстовых сообщений WhatsApp через GREEN-API.
Сначала прочтите инструкцию ["перед началом работы"](https://green-api.com/docs/before-start/). Пользователь авторизуется по `idInstance` и `apiTokenInstance`, создаёт чат по номеру телефона и получает ответы через HTTP long polling.

## Демо

- Стенд: https://green-api-delta-kohl.vercel.app/

## Локальный запуск

Требования: Node.js 20.19+ и Yarn.

```bash
git clone https://github.com/zhuravlev-v/green-api.git
cd green-api
yarn install
cp .env.example .env
yarn dev
```

После запуска откройте адрес из вывода Vite. В `.env` при необходимости укажите API URL вашего инстанса (берется из apiUrl на странице инстанса console.green-api.com):

```env
VITE_API_URL=https://api.green-api.com
```

Для получения сообщений в настройках инстанса GREEN-API оставьте `webhookUrl` пустым и включите входящие уведомления (`incomingWebhook`). Инстанс должен быть авторизован.

## Возможности

- проверка credentials и состояния WhatsApp-инстанса;
- создание личного чата через `CheckWhatsapp`;
- загрузка последних 100 сообщений;
- отправка текста через `SendMessage`;
- получение уведомлений через `ReceiveNotification` и `DeleteNotification`;
- поддержка идентификаторов `@lid` и `@c.us`;
- адаптивный интерфейс в стилистике WhatsApp.

## Стек и структура

React 19, TypeScript, Vite, React Router, TanStack React Query, Zustand, Zod, React Hook Form, Tailwind CSS, shadcn/ui и Chatscope Chat UI Kit.

Код организован в Feature-Sliced Design-like стиле: `app`, `pages`, `features`, `entities`, `shared`.

## Ограничения

- поддерживаются только личные текстовые сообщения;
- приложение рассчитано на одну активную вкладку для одного инстанса;
- credentials хранятся в `localStorage` и передаются из браузера напрямую в GREEN-API;
- для полноценной проверки требуется авторизованный инстанс GREEN-API.
