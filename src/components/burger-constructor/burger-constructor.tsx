import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorBun,
  getConstructorIngredientsList,
  clearBurgerConstructor
} from '../../services/constructor/slice';

import {
  getOrderRequestStatus,
  getOrderModalData,
  setOrderRequest,
  clearOrderModalData
} from '../../services/order/slice';
import { makeOrder } from '../../services/order/action';
import { Navigate, useNavigate } from 'react-router-dom';
import { addUserOrder } from '../../services/userOrders/slice';
import { getUser } from '../../services/user/slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUser);

  const constructorItems = {
    bun: useSelector(getConstructorBun),
    ingredients: useSelector(getConstructorIngredientsList)
  };

  const orderRequest = useSelector(getOrderRequestStatus);
  const orderModalData = useSelector(getOrderModalData);
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    }
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      const ingredientIds: string[] = [
        ...(constructorItems.bun
          ? [constructorItems.bun._id, constructorItems.bun._id]
          : []), // булка дважды
        ...constructorItems.ingredients.map((item) => item._id)
      ];
      dispatch(setOrderRequest(true));
      dispatch(makeOrder(ingredientIds));
    }
  };
  useEffect(() => {
    if (orderModalData) {
      dispatch(addUserOrder(orderModalData));
      dispatch(clearBurgerConstructor());
    }
  }, [orderModalData]);

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
