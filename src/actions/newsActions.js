import {
  SET_NEWS_DATA,
  MARK_FAVORITE_NEWS,
  LOADING_DATA,
  CHECK_ALL_FAVORITE_NEWS,
} from "../types";
import axios from "axios";

/* Get News data */
export const getNewsData = () => (dispatch, getState) => {
  const offset = getState().newsData.offset;
  dispatch({
    type: LOADING_DATA,
  });

  axios
    .get("/api/get-news-data", {
      params: {
        offset,
      },
    })
    .then((res) => {
      dispatch({
        type: SET_NEWS_DATA,
        payload: {
          data: res.data.data,
          maxLimit: res.data.maxLimit,
        },
      });
      if (getState().user.id) {
        dispatch({
          type: CHECK_ALL_FAVORITE_NEWS,
          payload: getState().user.favorites,
        });
      }
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
