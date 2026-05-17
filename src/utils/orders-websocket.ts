import { getCookie } from './cookie';
import { getWsBaseUrl } from './api-config';
import { TOrder } from './types';

type TOrdersStreamMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  message?: string;
};

const getAccessTokenValue = () =>
  getCookie('accessToken')?.replace(/^Bearer\s+/i, '') ?? null;

export const getFeedOrdersWsUrl = () => `${getWsBaseUrl()}/orders/all`;

export const getUserOrdersWsUrl = () => {
  const token = getAccessTokenValue();

  return token ? `${getWsBaseUrl()}/orders?token=${token}` : null;
};

export const parseOrdersStreamMessage = (rawData: string) => {
  const data = JSON.parse(rawData) as TOrdersStreamMessage;

  if (!data.success) {
    throw new Error(data.message || 'WebSocket stream returned an error');
  }

  return data;
};
