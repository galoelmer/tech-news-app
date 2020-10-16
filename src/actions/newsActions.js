import { SET_NEWS_DATA, MARK_FAVORITE_NEWS, LOADING_DATA } from '../types';

import axios from 'axios';

/* Get News data */
export const getNewsData = (userId) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/api/fetch-news?from=firestore&userId=${userId}`)
    .then((res) => {
      dispatch({ type: SET_NEWS_DATA, payload: res.data.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

/* Mark Favorites News */
export const markFavoriteNews = (id) => (dispatch) => {
  dispatch({ type: MARK_FAVORITE_NEWS, payload: id });
};
