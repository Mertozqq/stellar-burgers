import {
  orderSlice,
  setOrderRequest,
  clearOrderModalData,
  initialState
} from '../src/services/order/slice';
import { makeOrder } from '../src/services/order/action';
import type { TOrder } from '../src/utils/types';

describe('orderSlice reducer (reducers + extraReducers)', () => {
  const makeTestOrder = (id: string, number: number): TOrder => ({
    _id: id,
    status: 'done',
    name: `order-${id}`,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    number,
    ingredients: ['1', '2']
  });

  const getFreshInitialState = (
    orderModalData: TOrder | null = initialState.orderModalData,
    orderRequest: boolean = initialState.orderRequest
  ) => ({
    ...initialState,
    orderModalData,
    orderRequest
  });

  it('setOrderRequest: устанавливает orderRequest', () => {
    const nextState = orderSlice.reducer(
      getFreshInitialState(),
      setOrderRequest(true)
    );

    expect(nextState.orderRequest).toBe(true);
    expect(nextState.orderModalData).toBeNull();
  });

  it('clearOrderModalData: сбрасывает orderModalData в null и orderRequest в false', () => {
    const prevState = getFreshInitialState(makeTestOrder('1', 1), true);

    const nextState = orderSlice.reducer(prevState, clearOrderModalData());

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.orderModalData).toBeNull();
  });

  it('makeOrder.pending: orderRequest=true, orderModalData=null', () => {
    const prevState = getFreshInitialState(makeTestOrder('old', 99), false);

    const nextState = orderSlice.reducer(
      prevState,
      makeOrder.pending('req-1', ['ing-1', 'ing-2'])
    );

    expect(nextState.orderRequest).toBe(true);
    expect(nextState.orderModalData).toBeNull();
  });

  it('makeOrder.rejected: orderRequest=false, orderModalData=null', () => {
    const prevState = getFreshInitialState(makeTestOrder('old', 99), true);

    const nextState = orderSlice.reducer(
      prevState,
      makeOrder.rejected(new Error('Network error'), 'req-1', ['ing-1', 'ing-2'])
    );

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.orderModalData).toBeNull();
  });

  it('makeOrder.fulfilled: orderRequest=false, orderModalData записывается из payload.order', () => {
    const prevState = getFreshInitialState(null, true);

    const order = makeTestOrder('new', 100);

    const payload = {
      success: true,
      order,
      name: 'Тестовый бургер'
    };

    const nextState = orderSlice.reducer(
      prevState,
      makeOrder.fulfilled(payload, 'req-1', ['ing-1', 'ing-2'])
    );

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.orderModalData).toEqual(order);
  });
});