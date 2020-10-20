import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import userReducer from './reducers/userReducers';
import newsReducer from './reducers/newsReducers';
import uiReducer from './reducers/uiReducers';

const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
  user: userReducer,
  newsData: newsReducer,
  UI: uiReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
