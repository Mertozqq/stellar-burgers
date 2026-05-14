import { userOrdersSlice, addUserOrder, initialState } from '../src/services/userOrders/slice';
import { getUserOrdersAction } from '../src/services/userOrders/action';
import type { TOrder } from '../src/utils/types';

describe('userOrdersSlice reducer (reducers + extraReducers)', () => {
  const makeOrder = (id: string, number: number): TOrder => ({
    _id: id,
    status: 'done',
    name: `order-${id}`,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number,
    ingredients: ['1', '2']
  });

  const getFreshInitialState = (orders: TOrder[] = initialState.orders) => ({
    ...initialState,
    orders: [...orders]
  });

  it('addUserOrder: добавляет заказ в конец списка', () => {
    const prevState = getFreshInitialState([makeOrder('1', 1)]);
    const newOrder = makeOrder('2', 2);

    const nextState = userOrdersSlice.reducer(prevState, addUserOrder(newOrder));

    expect(nextState.orders).toHaveLength(2);
    expect(nextState.orders).toEqual([prevState.orders[0], newOrder]);
  });

  it('getUserOrdersAction.fulfilled: записывает список заказов в стор', () => {
    const prevState = getFreshInitialState([makeOrder('old', 99)]);
    const payload: TOrder[] = [makeOrder('1', 1), makeOrder('2', 2)];

    const nextState = userOrdersSlice.reducer(
      prevState,
      getUserOrdersAction.fulfilled(payload, 'req-1', undefined)
    );

    expect(nextState.orders).toEqual(payload);
  });

  it('getUserOrdersAction.pending: состояние не меняется (текущее поведение)', () => {
    const prevState = getFreshInitialState([makeOrder('1', 1)]);

    const nextState = userOrdersSlice.reducer(
      prevState,
      getUserOrdersAction.pending('req-1', undefined)
    );

    expect(nextState.orders).toEqual(prevState.orders);
  });

  it('getUserOrdersAction.rejected: состояние не меняется (текущее поведение)', () => {
    const prevState = getFreshInitialState([makeOrder('1', 1)]);

    const nextState = userOrdersSlice.reducer(
      prevState,
      getUserOrdersAction.rejected(new Error('Network error'), 'req-1', undefined)
    );

    expect(nextState.orders).toEqual(prevState.orders);
  });
});