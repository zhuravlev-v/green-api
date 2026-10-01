export {
  ApiError,
  configureApiClient,
  isApiError,
  request,
  type ApiErrorKind,
  type InstanceCredentials,
} from './http-client';
export {
  getStateInstance,
  getStateInstanceResponseSchema,
  instanceStateSchema,
  type GetStateInstanceResponse,
  type InstanceState,
} from './endpoints/state-instance.get';
export {
  getSettings,
  getSettingsResponseSchema,
  type GetSettingsResponse,
} from './endpoints/settings.get';
export {
  checkWhatsapp,
  checkWhatsappResponseSchema,
  type CheckWhatsappResponse,
} from './endpoints/check-whatsapp.post';
export {
  getChatHistory,
  getChatHistoryResponseSchema,
  chatHistoryMessageSchema,
  type ChatHistoryMessage,
  type GetChatHistoryResponse,
} from './endpoints/chat-history.post';
export {
  getChats,
  getChatsResponseSchema,
  chatSchema,
  type ApiChat,
  type GetChatsResponse,
} from './endpoints/chats.get';
export {
  sendMessage,
  sendMessageResponseSchema,
  type SendMessagePayload,
  type SendMessageResponse,
} from './endpoints/message.post';
export {
  readChat,
  readChatResponseSchema,
  type ReadChatResponse,
} from './endpoints/read-chat.post';
export {
  receiveNotification,
  receiveNotificationResponseSchema,
  type ReceiveNotificationResponse,
} from './endpoints/notification.get';
export {
  deleteNotification,
  deleteNotificationResponseSchema,
  type DeleteNotificationResponse,
} from './endpoints/notification.delete';
