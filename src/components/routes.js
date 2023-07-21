import React from 'react';
import { Navigate } from 'next/navigation'

export const PublicRoute = ({isAuth, to = "/panel", children}) => {
  return !isAuth ? children : <Navigate to={to} replace/>
};

export const PrivateRoute = ({isAuth, to = "/", children}) => {
  return isAuth ? children : <Navigate to={to} replace/>
};

export const AdminRoute = ({isAdmin, to = '/', children}) => {
  return isAdmin ? children : <Navigate to={to} replace/>
}