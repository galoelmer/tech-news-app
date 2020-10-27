import { SET_NEWS_DATA, MARK_FAVORITE_NEWS, LOADING_DATA } from '../types';

import axios from 'axios';

/* Get News data */
export const getNewsData = (userId) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/api/get-news-data?userId=${userId}`)
    .then((res) => {
      dispatch({ type: SET_NEWS_DATA, payload: res.data.data });
    })
    .catch((err) => {
      dispatch({ type: SET_NEWS_DATA, payload: [] });
      console.log(err);
    });
};

/* Mark Favorites News */
export const markFavoriteNews = (id) => (dispatch) => {
  dispatch({ type: MARK_FAVORITE_NEWS, payload: id });
};
