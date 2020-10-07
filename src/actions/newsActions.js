import { SET_NEWS_DATA, MARK_FAVORITE_NEWS } from '../types';

import axios from 'axios';

/* Get News data */
export const getNewsData = (userId) => (dispatch) => {
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
