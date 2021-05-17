import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import ScreenLogin1 from './ScreenLogin1';
import ScreenSignUpManager from './ScreenSignUpManager';
import ScreenSignUpCollab from './ScreenSignUpCollab';

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
      
      </Switch>
    </Router>
    </Provider> 
  );
}

export default App;
