import { userOrdersSlice, addUserOrder } from '../src/services/userOrders/slice';
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

  it('addUserOrder: добавляет заказ в конец списка', () => {
    const initialState = { orders: [makeOrder('1', 1)] };

    const newOrder = makeOrder('2', 2);

    const nextState = userOrdersSlice.reducer(initialState, addUserOrder(newOrder));

    expect(nextState.orders).toHaveLength(2);
    expect(nextState.orders).toEqual([initialState.orders[0], newOrder]);
  });

  it('getUserOrdersAction.fulfilled: записывает список заказов в стор', () => {
    const initialState = { orders: [makeOrder('old', 99)] };

    const payload: TOrder[] = [makeOrder('1', 1), makeOrder('2', 2)];

    const nextState = userOrdersSlice.reducer(
      initialState,
      getUserOrdersAction.fulfilled(payload, 'req-1', undefined)
    );

    expect(nextState.orders).toEqual(payload);
  });

  it('getUserOrdersAction.pending: состояние не меняется (текущее поведение)', () => {
    const initialState = { orders: [makeOrder('1', 1)] };

    const nextState = userOrdersSlice.reducer(
      initialState,
      getUserOrdersAction.pending('req-1', undefined)
    );

    expect(nextState).toEqual(initialState);
  });

  it('getUserOrdersAction.rejected: состояние не меняется (текущее поведение)', () => {
    const initialState = { orders: [makeOrder('1', 1)] };

    const nextState = userOrdersSlice.reducer(
      initialState,
      getUserOrdersAction.rejected(new Error('Network error'), 'req-1', undefined)
    );

    expect(nextState).toEqual(initialState);
  });
});