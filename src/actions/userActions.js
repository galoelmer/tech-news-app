import { SET_USER, SET_UNAUTHENTICATED } from '../types';

import axios from 'axios';

/* SignUp user action */
export const signupUser = (newUserData, history) => (dispatch) => {
  axios
  .post('/api/signup', newUserData)
  .then((res) => {
    setAuthenticationHeader(res.data.token);
    dispatch(getUserData());
    history.push('/');
  })
  .catch((err) => {
    console.log(err);
  });
};

/* Login User action */
export const loginUser = (userData, history) => (dispatch) => {
  axios
  .post('/api/login', userData)
  .then((res) => {
      setAuthenticationHeader(res.data.token);
      dispatch(getUserData());
      history.push('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

/* Get user data action */
export const getUserData = () => (dispatch) => {
  axios
    .get('/api/get-user-data')
    .then((res) => {
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch((err) => console.log(err));
};

/* Log out user action */
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
};

/* Set firebase token to HTTP Authorization header and store it in localStorage api  */
const setAuthenticationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
};
