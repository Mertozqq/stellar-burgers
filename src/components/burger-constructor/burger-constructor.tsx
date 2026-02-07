import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorBun,
  getConstructorIngredientsList
} from '../../services/constructor/slice';

import {
  getOrderRequestStatus,
  getOrderModalData,
  setOrderRequest,
  clearOrderModalData
} from '../../services/order/slice';
import { makeOrder } from '../../services/order/action';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = {
    bun: useSelector(getConstructorBun),
    ingredients: useSelector(getConstructorIngredientsList)
  };
  const ingredientIds: string[] = [
    ...(constructorItems.bun
      ? [constructorItems.bun._id, constructorItems.bun._id]
      : []), // булка дважды
    ...constructorItems.ingredients.map((item) => item._id)
  ];
  // useEffect(() => {
  //   dispatch(makeOrder(ingredientIds));
  // }, [dispatch]);

  const orderRequest = useSelector(getOrderRequestStatus);
  const orderModalData = useSelector(getOrderModalData);
  // сделать
  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) {
      return;
    } else {
      dispatch(setOrderRequest(true));
      dispatch(makeOrder(ingredientIds));
    }
  };
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

  // return null;

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
