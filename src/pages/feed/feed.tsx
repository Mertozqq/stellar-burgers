import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import {
  getFeedOrdersStatus,
  getFeedOrders
} from '../../services/feedOrders/slice';
import { getOrdersApi } from '../../services/feedOrders/action';
export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersApi());
  }, [dispatch]);
  const orders: TOrder[] = useSelector(getFeedOrders);
  const loading = useSelector(getFeedOrdersStatus);
  if (loading) {
    return <Preloader />;
  }
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getOrdersApi())} />
  );
};
