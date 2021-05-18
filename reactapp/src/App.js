import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import ScreenLogin1 from './views/ScreenLogin1';
import ScreenLogin2 from './views/ScreenLogin2'
import ScreenSignUpManager from './views/ScreenSignUpManager';
import ScreenSignUpCollab from './views/ScreenSignUpCollab';
import ScreenDashboard from './views/ScreenDashboard'
import ScreenListen from './views/ScreenListen';
import ScreenHistoriqueCollab from './views/ScreenHistoriqueCollab';
import ScreenHistoriqueManager from './views/ScreenHistoriqueManager';
import ScreenMyAcount from './views/ScreenMyAcount';
import ScreenInfosPersonnelles from './views/ScreenInfosPersonnelles';

import email from './reducers/email';
import user from './reducers/user';
import shownModal from './reducers/shownModal';

import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';

const store = createStore(combineReducers({email, user, shownModal}));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/"component={ScreenLogin1}/>
          <Route path="/sign-up-manager"component={ScreenSignUpManager}/>
          <Route path="/sign-up-collab"component={ScreenSignUpCollab}/>
          <Route exact path="/listen" component={ScreenListen}/>
          <Route exact path="/dashboard" component={ScreenDashboard}/>
          <Route path="/historique-collab" component={ScreenHistoriqueCollab}/>
          <Route path="/historique-manager" component={ScreenHistoriqueManager}/>
          <Route exact path="/login2" component={ScreenLogin2}/>
          <Route exact path="/myAcount" component={ScreenMyAcount}/>
          <Route exact path="/informations-personnelles" component={ScreenInfosPersonnelles}/>
        </Switch>
      </Router>
    </Provider> 
  );
}

export default App;