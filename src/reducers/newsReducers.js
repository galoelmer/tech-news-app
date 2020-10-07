import {
  SET_NEWS_DATA,
  MARK_FAVORITE_NEWS,
  UNMARK_FAVORITE_NEWS,
} from '../types';

const initialState = {
  articles: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_NEWS_DATA:
      return {
        ...state,
        articles: action.payload,
      };

    case MARK_FAVORITE_NEWS: {
      state.articles.forEach((article) => {
        if (article.id === action.payload) {
          article.favorite = article.favorite ? !article.favorite : true;
          return { ...state };
        }
      });
      return { ...state };
    }

    case UNMARK_FAVORITE_NEWS: {
      state.articles.forEach((article) => {
        if (article.favorite) delete article.favorite;
      });

      return { ...state };
    }

    default:
      return state;
  }
}
