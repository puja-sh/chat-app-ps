import React from 'react';
import { Redirect, Route } from 'react-router';

const PrivateRoute = ({ children, ...restProps }) => {
  const profile = false;

  if (!profile) {
    return <Redirect to="/signin" />;
  }
  return <Route {...restProps}>{children}</Route>;
};

export default PrivateRoute;
