import React from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={Signup} />
        </Switch>
      </Router>
    </React.Fragment>
  );
}

export default App;
