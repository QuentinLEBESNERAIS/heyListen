import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import ScreenLogin1 from './views/ScreenLogin1';
import ScreenLogin2 from './views/ScreenLogin2'
import ScreenSignUpManager from './views/ScreenSignUpManager';
import ScreenSignUpCollab from './views/ScreenSignUpCollab';
import ScreenDashboard from './views/ScreenDashboard'
import ScreenListen from './views/ScreenListen';
import ScreenMyAcount from './views/ScreenMyAcount'


import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';

const store = createStore(combineReducers({}));
function App() {
  return (
    <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/"component={ScreenLogin1} />
        <Route path="/sign-up-manager"component={ScreenSignUpManager} />
        <Route path="/sign-up-collab"component={ScreenSignUpCollab} />
        <Route component={ScreenListen} path="/listen" exact />
        <Route component={ScreenDashboard} path="/dashboard" exact />
        <Route component={ScreenLogin2} path="/login2" exact />
        <Route component={ScreenMyAcount} path="/myAcount" exact />
      </Switch>
    </Router>
    </Provider> 
  );
}

export default App;
