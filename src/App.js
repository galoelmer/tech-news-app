import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import Navbar from './components/Navbar';

/* Redux */
import { Provider } from 'react-redux';
import store from './store';
import { SET_AUTHENTICATED } from './types';
import {getUserData, logoutUser} from './actions/userActions';

/* Pages */
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';


/* Decode authentication Token
-------------------------------------------------- */
const token = localStorage.FBIdToken;
/**
    TODO:
    - Verify this is a valid firebase token
*/

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}
/* End of Decode authentication Token
-------------------------------------------------- */

function App() {
  return (
    <React.Fragment>
      <Provider store={store}>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
          </Switch>
        </Router>
      </Provider>
    </React.Fragment>
  );
}

export default App;
