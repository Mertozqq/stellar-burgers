import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserOrders,
  getUserOrdersLoading,
  setUserOrdersConnecting,
  setUserOrdersData,
  setUserOrdersDisconnected,
  setUserOrdersError
} from '../../services/userOrders/slice';
import { useOrdersWebSocket } from '../../hooks/use-orders-websocket';
import {
  getUserOrdersWsUrl,
  parseOrdersStreamMessage
} from '../../utils/orders-websocket';
import { Preloader } from '../../components/ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getUserOrders);
  const loading = useSelector(getUserOrdersLoading);
  const userOrdersWsUrl = getUserOrdersWsUrl();

  useOrdersWebSocket({
    url: userOrdersWsUrl,
    enabled: Boolean(userOrdersWsUrl),
    onOpen: () => dispatch(setUserOrdersConnecting()),
    onClose: () => dispatch(setUserOrdersDisconnected()),
    onError: (error) => dispatch(setUserOrdersError(error)),
    onMessage: (rawData) => {
      try {
        const data = parseOrdersStreamMessage(rawData);
        dispatch(setUserOrdersData(data.orders));
      } catch (error) {
        dispatch(
          setUserOrdersError(
            error instanceof Error ? error.message : 'Invalid user orders data'
          )
        );
      }
    }
  });

  if (loading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
