import { userSlice, setIsAuthChecked, setUser, initialState } from '../src/services/user/slice';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getUserData,
  updateUser
} from '../src/services/user/actions';

import type { TUser } from '../src/utils/types';
import type { TLoginData, TRegisterData } from '../src/utils/burger-api';

describe('userSlice reducer (reducers + extraReducers)', () => {
  const makeUser = (email: string, name = 'Test User'): TUser => ({
    email,
    name
  });

  const getFreshInitialState = (override?: Partial<typeof initialState>) => ({
    ...initialState,
    ...override
  });

  it('setUser: устанавливает user', () => {
    const user = makeUser('test@mail.com');

    const nextState = userSlice.reducer(getFreshInitialState(), setUser(user));

    expect(nextState.user).toEqual(user);
  });

  it('setIsAuthChecked: устанавливает isAuthChecked', () => {
    const nextState = userSlice.reducer(
      getFreshInitialState(),
      setIsAuthChecked(true)
    );

    expect(nextState.isAuthChecked).toBe(true);
  });

  it('login.fulfilled: user устанавливается, isAuthChecked=true', () => {
    const user = makeUser('login@mail.com');

    const arg: TLoginData = {
      email: 'login@mail.com',
      password: '123'
    };

    const nextState = userSlice.reducer(
      getFreshInitialState(),
      login.fulfilled(user, 'req-1', arg)
    );

    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthChecked).toBe(true);
  });

  it('register.fulfilled: user устанавливается, isAuthChecked=true', () => {
    const user = makeUser('register@mail.com');

    const arg: TRegisterData = {
      email: 'register@mail.com',
      password: '123',
      name: 'Reg'
    };

    const nextState = userSlice.reducer(
      getFreshInitialState(),
      register.fulfilled(user, 'req-1', arg)
    );

    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthChecked).toBe(true);
  });

  it('logout.fulfilled: user сбрасывается в null', () => {
    const prevState = getFreshInitialState({
      user: makeUser('old@mail.com'),
      isAuthChecked: true
    });

    const nextState = userSlice.reducer(
      prevState,
      logout.fulfilled(true, 'req-1', undefined)
    );

    expect(nextState.user).toBeNull();
    expect(nextState.isAuthChecked).toBe(true);
  });

  it('forgotPassword.fulfilled: error сбрасывается в null', () => {
    const prevState = getFreshInitialState({
      error: 'Some error'
    });

    const arg = { email: 'a@b.com' };
    const payload = { success: true };

    const nextState = userSlice.reducer(
      prevState,
      forgotPassword.fulfilled(payload as any, 'req-1', arg)
    );

    expect(nextState.error).toBeNull();
  });

  it('resetPassword.fulfilled: user сбрасывается в null', () => {
    const prevState = getFreshInitialState({
      user: makeUser('old@mail.com'),
      isAuthChecked: true
    });

    const arg = { password: 'newpass', token: 'token' };

    const nextState = userSlice.reducer(
      prevState,
      resetPassword.fulfilled(true, 'req-1', arg)
    );

    expect(nextState.user).toBeNull();
  });

  it('getUserData.fulfilled: isAuthChecked=true, user берётся из payload.user', () => {
    const user = makeUser('get@mail.com');
    const payload = { success: true, user };

    const nextState = userSlice.reducer(
      getFreshInitialState(),
      getUserData.fulfilled(payload as any, 'req-1', undefined)
    );

    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.user).toEqual(user);
  });

  it('getUserData.rejected: isAuthChecked=true, user=null', () => {
    const prevState = getFreshInitialState({
      user: makeUser('old@mail.com'),
      isAuthChecked: false
    });

    const nextState = userSlice.reducer(
      prevState,
      getUserData.rejected(new Error('Auth error'), 'req-1', undefined)
    );

    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.user).toBeNull();
  });

  it('updateUser.fulfilled: user обновляется из payload.user', () => {
    const prevState = getFreshInitialState({
      user: makeUser('old@mail.com'),
      isAuthChecked: true
    });

    const updatedUser = makeUser('new@mail.com', 'Updated');
    const arg: TUser = updatedUser;

    const payload = { success: true, user: updatedUser };

    const nextState = userSlice.reducer(
      prevState,
      updateUser.fulfilled(payload as any, 'req-1', arg)
    );

    expect(nextState.user).toEqual(updatedUser);
  });
});