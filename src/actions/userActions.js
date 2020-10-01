import { SET_USER } from '../types';

import axios from 'axios';

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

export const getUserData = () => (dispatch) => {
  axios
    .get('/api/get-user-data')
    .then((res) => {
      dispatch({ type: SET_USER, payload: res.data });
    })
    .catch((err) => console.log(err));
};

const setAuthenticationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
};
