import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NoMatch from '@components/noMatch';
import RouteWithSubRoutes from '@components/routeWithSubRoutes';

import routes from './routes';

import '@assets/styles/index.less';

const render = () => {
  const rootElement = document.getElementById('app');
  const App: React.FC = () => (
    // @ts-ignore
    <Router basename='/webpack-plugin-demo/'>
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
        <Route path='*'>
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );

  ReactDOM.render(<App />, rootElement);
};

render();
