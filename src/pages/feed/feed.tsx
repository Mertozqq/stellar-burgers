import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorBun,
  getConstructorIngredientsList
} from '../../services/constructor/slice';

import {
  getFeedOrdersStatus,
  getFeedOrders
} from '../../services/feedOrders/slice';
import { makeOrder } from '../../services/order/action';
export const Feed: FC = () => {
  /** TODO: взять переменную из стора */

  const orders: TOrder[] = useSelector(getFeedOrders);

  if (!orders.length) {
    return <Preloader />;
  }

  <FeedUI orders={orders} handleGetFeeds={() => {}} />;
};
