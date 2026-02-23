import { feedOrdersSlice } from '../src/services/feedOrders/slice';
import { getOrdersApi } from '../src/services/feedOrders/action';
import type { TOrder } from '../src/utils/types';

describe('feedOrdersSlice reducer (extraReducers)', () => {
  const makeOrder = (id: string, number: number): TOrder => ({
    _id: id,
    status: 'done',
    name: `order-${id}`,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number,
    ingredients: ['1', '2']
  });

  it('pending: loading становится true', () => {
    const initialState = {
      orders: [],
      loading: false,
      total: 0,
      totalToday: 0
    };

    const nextState = feedOrdersSlice.reducer(
      initialState,
      getOrdersApi.pending('req-1')
    );

    expect(nextState.loading).toBe(true);
    expect(nextState.orders).toEqual([]);
    expect(nextState.total).toBe(0);
    expect(nextState.totalToday).toBe(0);
  });

  it('rejected: loading становится false', () => {
    const initialState = {
      orders: [makeOrder('1', 1)],
      loading: true,
      total: 10,
      totalToday: 5
    };

    const action = getOrdersApi.rejected(
      new Error('Network error'),
      'req-1'
    );

    const nextState = feedOrdersSlice.reducer(initialState, action);

    expect(nextState.loading).toBe(false);
    expect(nextState.orders).toEqual(initialState.orders);
    expect(nextState.total).toBe(10);
    expect(nextState.totalToday).toBe(5);
  });

  it('fulfilled: записывает orders, total и totalToday, loading становится false', () => {
    const initialState = {
      orders: [],
      loading: true,
      total: 0,
      totalToday: 0
    };

    const orders = [makeOrder('1', 1), makeOrder('2', 2)];

    const payload = {
      success: true,
      orders,
      total: 200,
      totalToday: 20
    };

    const nextState = feedOrdersSlice.reducer(
      initialState,
      getOrdersApi.fulfilled(payload, 'req-1')
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.orders).toEqual(orders);
    expect(nextState.total).toBe(200);
    expect(nextState.totalToday).toBe(20);
  });
});