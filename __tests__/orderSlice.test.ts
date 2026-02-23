import { orderSlice, setOrderRequest, clearOrderModalData } from '../src/services/order/slice';
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

  it('setOrderRequest: устанавливает orderRequest', () => {
    const initialState = { orderRequest: false, orderModalData: null as TOrder | null };

    const nextState = orderSlice.reducer(initialState, setOrderRequest(true));

    expect(nextState.orderRequest).toBe(true);
    expect(nextState.orderModalData).toBeNull();
  });

  it('clearOrderModalData: сбрасывает orderModalData в null и orderRequest в false', () => {
    const initialState = {
      orderRequest: true,
      orderModalData: makeTestOrder('1', 1)
    };

    const nextState = orderSlice.reducer(initialState, clearOrderModalData());

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.orderModalData).toBeNull();
  });

  it('makeOrder.pending: orderRequest=true, orderModalData=null', () => {
    const initialState = {
      orderRequest: false,
      orderModalData: makeTestOrder('old', 99)
    };

    const nextState = orderSlice.reducer(initialState, makeOrder.pending('req-1', ['ing-1', 'ing-2']));

    expect(nextState.orderRequest).toBe(true);
    expect(nextState.orderModalData).toBeNull();
  });

  it('makeOrder.rejected: orderRequest=false, orderModalData=null', () => {
    const initialState = {
        orderRequest: true,
        orderModalData: makeTestOrder('old', 99)
    };

    const nextState = orderSlice.reducer(
        initialState,
        makeOrder.rejected(new Error('Network error'), 'req-1', ['ing-1', 'ing-2'])
    );

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.orderModalData).toBeNull();
    });

  it('makeOrder.fulfilled: orderRequest=false, orderModalData записывается из payload.order', () => {
    const initialState = { orderRequest: true, orderModalData: null as TOrder | null };

    const order = makeTestOrder('new', 100);
    const payload = {
        success: true,
        order,
        name: 'Тестовый бургер'
    };

    const nextState = orderSlice.reducer(
        initialState,
        makeOrder.fulfilled(payload, 'req-1', ['ing-1', 'ing-2'])
    );

    expect(nextState.orderRequest).toBe(false);
    expect(nextState.orderModalData).toEqual(order);
    });
});