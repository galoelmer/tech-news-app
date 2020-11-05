import { SET_NEWS_DATA, MARK_FAVORITE_NEWS, LOADING_DATA } from '../types';
import axios from 'axios';

/* Get News data */
export const getNewsData = (userId, offset) => (dispatch, getState) => {
  dispatch({
    type: LOADING_DATA,
  });

  axios
    .get('/api/get-news-data', {
      params: {
        offset,
      },
    })
    .then((res) => {
      const data = userId
        ? markFavorites(getState().user.favorites, [
            ...getState().newsData.articles,
            ...res.data.data,
          ])
        : res.data.data;
      dispatch({
        type: SET_NEWS_DATA,
        payload: {
          data,
          maxLimit: res.data.maxLimit,
        },
      });
    })
    .catch((err) => {
      dispatch({ type: SET_NEWS_DATA, payload: { data: [], maxLimit: true } });
      console.log(err);
    });
};

/* Mark Favorites News */
export const markFavoriteNews = (id) => (dispatch) => {
  dispatch({ type: MARK_FAVORITE_NEWS, payload: id });
};

// Check if user added article to favorites
const markFavorites = (userFavorites, currentNews) => {
  const favoritesId = userFavorites.map((item) => item.articleId);
  return currentNews.map((item) => {
    if (favoritesId.includes(item.id)) {
      item.favorite = true;
    }
    return item;
  });
};
