import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ReactElement } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getIsAuthChecked, getUser } from '../../services/user/slice';
import { Login, Register } from '@pages';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const { onlyUnAuth = false, component } = props;
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUser);
  const location = useLocation();
  if (!isAuthChecked) {
    return;
  }
  if (!onlyUnAuth && !user) {
    return <Navigate to={'/login'} state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }
  return component;
};
