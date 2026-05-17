import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import {
  getFeedOrders,
  getFeedOrdersStatus,
  setFeedOrdersConnecting,
  setFeedOrdersData,
  setFeedOrdersDisconnected,
  setFeedOrdersError
} from '../../services/feedOrders/slice';
import { useOrdersWebSocket } from '../../hooks/use-orders-websocket';
import {
  getFeedOrdersWsUrl,
  parseOrdersStreamMessage
} from '../../utils/orders-websocket';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(getFeedOrders);
  const loading = useSelector(getFeedOrdersStatus);

  const { reconnect } = useOrdersWebSocket({
    url: getFeedOrdersWsUrl(),
    onOpen: () => dispatch(setFeedOrdersConnecting()),
    onClose: () => dispatch(setFeedOrdersDisconnected()),
    onError: (error) => dispatch(setFeedOrdersError(error)),
    onMessage: (rawData) => {
      try {
        const data = parseOrdersStreamMessage(rawData);

        dispatch(
          setFeedOrdersData({
            orders: data.orders,
            total: data.total,
            totalToday: data.totalToday
          })
        );
      } catch (error) {
        dispatch(
          setFeedOrdersError(
            error instanceof Error ? error.message : 'Invalid feed data'
          )
        );
      }
    }
  });

  if (loading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={reconnect} />;
};
