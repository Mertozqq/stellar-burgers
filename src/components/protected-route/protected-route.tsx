import { Navigate, Outlet } from 'react-router-dom';
import { ReactElement } from 'react';
type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => props.children;
