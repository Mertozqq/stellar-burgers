import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';

import {
  getFeedOrderStatus,
  getFeedOrder
} from '../../services/feedOrder/slice';
import { getOrderByNumber } from '../../services/feedOrder/action';
import { useParams } from 'react-router-dom';
import { getIngredientsList } from '../../services/ingredients/slice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const id = number ? parseInt(number) : 0;

  useEffect(() => {
    dispatch(getOrderByNumber(id));
  }, [id, dispatch]);
  const order = useSelector(getFeedOrder);

  const orderData = order ?? {
    createdAt: '',
    ingredients: [],
    _id: '',
    status: '',
    name: '',
    updatedAt: 'string',
    number: 0
  };

  const ingredients: TIngredient[] = useSelector(getIngredientsList);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    // if (!orderData || !ingredients.length) {
    //   const orderData = {
    //   createdAt: '',
    //   ingredients: [],
    //   _id: '',
    //   status: '',
    //   name: '',
    //   updatedAt: 'string',
    //   number: 0
    // };
    // };

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData?.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
