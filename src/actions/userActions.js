import {
  SET_USER,
  SET_UNAUTHENTICATED,
  UNMARK_FAVORITE_NEWS,
  UNMARK_SINGLE_FAVORITE_NEWS,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  UPDATE_USERNAME,
} from '../types';
import { getNewsData } from './newsActions';
import axios from 'axios';

/* SignUp user action */
export const signupUser = (newUserData, history, setErrors, setSubmitting) => (
  dispatch
) => {
  axios
    .post('/api/signup', newUserData)
    .then((res) => {
      setAuthenticationHeader(res.data.token);
      dispatch(getUserData(history, setSubmitting));
    })
    .catch((err) => {
      // Just in case handling errors from server
      for (let [key, value] of Object.entries(err.response.data)) {
        setErrors(key, value);
      }
      setSubmitting(false);
    });
};

/* Login User action */
export const loginUser = (userData, history, setErrors, setSubmitting) => (
  dispatch
) => {
  axios
    .post('/api/login', userData)
    .then((res) => {
      setAuthenticationHeader(res.data.token);
      dispatch(getUserData(history, setSubmitting));
    })
    .catch((err) => {
      // Just in case handling errors from server
      for (let [key, value] of Object.entries(err.response.data)) {
        setErrors(key, value);
      }
      setSubmitting(false);
    });
};

/* Get user data action */
export const getUserData = (history, setSubmitting) => (dispatch) => {
  axios
    .get('/api/get-user-data')
    .then((res) => {
      dispatch({ type: SET_USER, payload: res.data });
      dispatch(getNewsData(res.data.userId));
      if (history || setSubmitting) {
        setSubmitting(false);
        history.push('/');
      }
    })
    .catch((err) => console.log(err));
};

/* Update Username */
export const updateUsername = (username) => (dispatch) => {
  axios
    .post('/api/update-username', { username })
    .then(() => {
      dispatch({type: UPDATE_USERNAME, payload: username })
    })
    .catch((err) => {
      console.log(err);
    });
};

/* Log out user action */
export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  delete axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
  dispatch({ type: UNMARK_FAVORITE_NEWS });
};

/* Add favorite news to user favorite list */
export const addToUserFavorites = (news) => (dispatch) => {
  dispatch({ type: ADD_TO_FAVORITES, payload: news });
};

/* Remove favorite news from user favorite list */
export const removeFromFavorites = (id) => (dispatch) => {
  dispatch({ type: REMOVE_FROM_FAVORITES, payload: id });
  dispatch({ type: UNMARK_SINGLE_FAVORITE_NEWS, payload: id });
};

/* Set firebase token to HTTP Authorization header and store it in localStorage api  */
const setAuthenticationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
};
