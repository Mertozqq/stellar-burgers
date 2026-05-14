import { combineSlices } from '@reduxjs/toolkit';

import { ingredientsSlice } from '../src/services/ingredients/slice';
import { burgerConstructorSlice } from '../src/services/constructor/slice';
import { orderSlice } from '../src/services/order/slice';
import { feedOrdersSlice } from '../src/services/feedOrders/slice';
import { feedOrderSlice } from '../src/services/feedOrder/slice';
import { userSlice } from '../src/services/user/slice';
import { userOrdersSlice } from '../src/services/userOrders/slice';

describe('rootReducer initialization', () => {
  it("rootReducer(undefined, {type:'UNKNOWN_ACTION'}) возвращает корректное начальное состояние", () => {
    const rootReducer = combineSlices(
      ingredientsSlice,
      burgerConstructorSlice,
      orderSlice,
      feedOrdersSlice,
      feedOrderSlice,
      userSlice,
      userOrdersSlice
    );

    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    const expectedInitialState = {
      [ingredientsSlice.name]: ingredientsSlice.getInitialState(),
      [burgerConstructorSlice.name]: burgerConstructorSlice.getInitialState(),
      [orderSlice.name]: orderSlice.getInitialState(),
      [feedOrdersSlice.name]: feedOrdersSlice.getInitialState(),
      [feedOrderSlice.name]: feedOrderSlice.getInitialState(),
      [userSlice.name]: userSlice.getInitialState(),
      [userOrdersSlice.name]: userOrdersSlice.getInitialState()
    };

    expect(state).toEqual(expectedInitialState);
  });
});