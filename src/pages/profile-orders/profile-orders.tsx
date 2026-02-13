import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getUserOrders } from '../../services/userOrders/slice';
import { getUserOrdersAction } from '../../services/userOrders/action';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(getUserOrders);

  useEffect(() => {
    dispatch(getUserOrdersAction());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
