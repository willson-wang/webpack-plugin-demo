import React from 'react';
import { Route } from 'react-router-dom';

interface IRoute {
  component?: any;
  exact?: boolean;
  path?: string;
  routes?: IRoute[];
  wrappers?: string[];
  title?: string;
  [key: string]: any;
}

const RouteWithSubRoutes: React.FC<IRoute> = (route: IRoute) => (
  <Route
    path={route.path}
    render={(props) => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
);

export default RouteWithSubRoutes;
