// __tests__/userSlice.test.ts
import { userSlice, setIsAuthChecked, setUser } from '../src/services/user/slice';
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

describe('userSlice reducer (reducers + extraReducers)', () => {
  const makeUser = (email: string, name = 'Test User'): TUser => ({
    email,
    name
  });

  it('setUser: устанавливает user', () => {
    const initialState = { user: null as TUser | null, isAuthChecked: false, error: null as string | null };
    const user = makeUser('test@mail.com');

    const nextState = userSlice.reducer(initialState, setUser(user));

    expect(nextState.user).toEqual(user);
  });

  it('setIsAuthChecked: устанавливает isAuthChecked', () => {
    const initialState = { user: null as TUser | null, isAuthChecked: false, error: null as string | null };

    const nextState = userSlice.reducer(initialState, setIsAuthChecked(true));

    expect(nextState.isAuthChecked).toBe(true);
  });

  it('login.fulfilled: user устанавливается, isAuthChecked=true', () => {
    const initialState = { user: null as TUser | null, isAuthChecked: false, error: null as string | null };
    const user = makeUser('login@mail.com');

    // login arg: TLoginData (судя по импорту). Мы не знаем поля, поэтому кладём минимально как unknown.
    const arg = { email: 'login@mail.com', password: '123' } as unknown;

    const nextState = userSlice.reducer(
      initialState,
      login.fulfilled(user, 'req-1', arg)
    );

    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthChecked).toBe(true);
  });

  it('register.fulfilled: user устанавливается, isAuthChecked=true', () => {
    const initialState = { user: null as TUser | null, isAuthChecked: false, error: null as string | null };
    const user = makeUser('register@mail.com');

    // register arg: TRegisterData (не знаем поля) — передаём минимально как unknown
    const arg = { email: 'register@mail.com', password: '123', name: 'Reg' } as unknown;

    const nextState = userSlice.reducer(
      initialState,
      register.fulfilled(user, 'req-1', arg)
    );

    expect(nextState.user).toEqual(user);
    expect(nextState.isAuthChecked).toBe(true);
  });

  it('logout.fulfilled: user сбрасывается в null', () => {
    const initialState = {
      user: makeUser('old@mail.com'),
      isAuthChecked: true,
      error: null as string | null
    };

    const nextState = userSlice.reducer(
      initialState,
      logout.fulfilled(true, 'req-1', undefined)
    );

    expect(nextState.user).toBeNull();
    expect(nextState.isAuthChecked).toBe(true);
  });

  it('forgotPassword.fulfilled: error сбрасывается в null', () => {
    const initialState = {
      user: null as TUser | null,
      isAuthChecked: false,
      error: 'Some error'
    };

    const arg = { email: 'a@b.com' };

    const payload = { success: true } as unknown;

    const nextState = userSlice.reducer(
      initialState,
      forgotPassword.fulfilled(payload, 'req-1', arg)
    );

    expect(nextState.error).toBeNull();
  });

  it('resetPassword.fulfilled: user сбрасывается в null', () => {
    const initialState = {
      user: makeUser('old@mail.com'),
      isAuthChecked: true,
      error: null as string | null
    };

    const arg = { password: 'newpass', token: 'token' };

    const nextState = userSlice.reducer(
      initialState,
      resetPassword.fulfilled(true, 'req-1', arg)
    );

    expect(nextState.user).toBeNull();
  });

  it('getUserData.fulfilled: isAuthChecked=true, user берётся из payload.user', () => {
    const initialState = {
      user: null as TUser | null,
      isAuthChecked: false,
      error: null as string | null
    };

    const user = makeUser('get@mail.com');

    const payload = { user };

    const nextState = userSlice.reducer(
      initialState,
      getUserData.fulfilled(payload, 'req-1', undefined)
    );

    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.user).toEqual(user);
  });

  it('getUserData.rejected: isAuthChecked=true, user=null', () => {
    const initialState = {
      user: makeUser('old@mail.com'),
      isAuthChecked: false,
      error: null as string | null
    };

    const nextState = userSlice.reducer(
      initialState,
      getUserData.rejected(new Error('Auth error'), 'req-1', undefined)
    );

    expect(nextState.isAuthChecked).toBe(true);
    expect(nextState.user).toBeNull();
  });

  it('updateUser.fulfilled: user обновляется из payload.user', () => {
    const initialState = {
      user: makeUser('old@mail.com'),
      isAuthChecked: true,
      error: null as string | null
    };

    const updatedUser = makeUser('new@mail.com', 'Updated');

    const arg: TUser = updatedUser;

    const payload = { user: updatedUser };

    const nextState = userSlice.reducer(
      initialState,
      updateUser.fulfilled(payload, 'req-1', arg)
    );
    expect(nextState.user).toEqual(updatedUser);
  });
});