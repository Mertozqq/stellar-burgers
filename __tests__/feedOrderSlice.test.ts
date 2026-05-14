import { feedOrderSlice, initialState } from '../src/services/feedOrder/slice';
import { getOrderByNumber as getOrderByNumberApi } from '../src/services/feedOrder/action';
import type { TOrder } from '../src/utils/types';

describe('feedOrderSlice reducer (extraReducers)', () => {
  const makeOrder = (id: string, number: number): TOrder => ({
    _id: id,
    status: 'done',
    name: `order-${id}`,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number,
    ingredients: ['1', '2']
  });

  const getFreshInitialState = () => ({
      ...initialState,
      order: initialState.order,
    });

  it('pending: loading становится true', () => {
    

    const nextState = feedOrderSlice.reducer(
      getFreshInitialState(),
      getOrderByNumberApi.pending('req-1', 123)
    );

    expect(nextState.loading).toBe(true);
    expect(nextState.order).toBeNull();
  });

  it('rejected: loading становится false, order сбрасывается в null', () => {
    

    const action = getOrderByNumberApi.rejected(
      new Error('Network error'),
      'req-1',
      123
    );

    const nextState = feedOrderSlice.reducer(getFreshInitialState(), action);

    expect(nextState.loading).toBe(false);
    expect(nextState.order).toBeNull();
  });

  it('fulfilled: loading становится false, order берётся из orders[0]', () => {
    

    const first = makeOrder('first', 100);
    const second = makeOrder('second', 101);

    const payload = { 
        orders: [first, second],
        success: true
    };

    const nextState = feedOrderSlice.reducer(
      getFreshInitialState(),
      getOrderByNumberApi.fulfilled(payload, 'req-1', 123)
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.order).toEqual(first);
  });

  it('fulfilled: если orders пустой массив, order становится undefined (текущее поведение)', () => {
    getFreshInitialState()

    const payload = { orders: [] as TOrder[],
        success: true
     };

    const nextState = feedOrderSlice.reducer(
      getFreshInitialState(),
      getOrderByNumberApi.fulfilled(payload, 'req-1', 123)
    );

    expect(nextState.loading).toBe(false);

    expect((nextState as any).order).toBeUndefined();
  });
});