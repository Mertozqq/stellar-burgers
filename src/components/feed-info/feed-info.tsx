import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorBun,
  getConstructorIngredientsList
} from '../../services/constructor/slice';

import {
  getFeedOrdersStatus,
  getFeedOrders,
  getFeedTotalToday,
  getFeedTotal
} from '../../services/feedOrders/slice';
import { getOrdersApi } from '../../services/feedOrders/action';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(getFeedOrders);
  const feed = {
    total: useSelector(getFeedTotal),
    totalToday: useSelector(getFeedTotalToday)
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
