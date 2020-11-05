import {
  SET_NEWS_DATA,
  MARK_FAVORITE_NEWS,
  UNMARK_FAVORITE_NEWS,
  UNMARK_SINGLE_FAVORITE_NEWS,
  LOADING_DATA,
} from '../types';

const initialState = {
  articles: [],
  loading: false,
  maxLimit: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_NEWS_DATA:
      return {
        ...state,
        articles: [...state.articles, ...action.payload.data],
        loading: false,
        maxLimit: action.payload.maxLimit,
      };

    case MARK_FAVORITE_NEWS:
      return Object.assign({}, state, {
        articles: markFavoriteNews(action.payload, state.articles),
      });

    case UNMARK_FAVORITE_NEWS:
      return Object.assign({}, state, {
        articles: state.articles.map((article) => {
          if (!article.hasOwnProperty('favorite')) return article;
          delete article.favorite;
          return article;
        }),
      });

    case UNMARK_SINGLE_FAVORITE_NEWS: {
      return Object.assign({}, state, {
        articles: state.articles.map((article) => {
          if (article.id === action.payload) delete article.favorite;
          return article;
        }),
      });
    }
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
}

const markFavoriteNews = (id, articles) => {
  return articles.map((article) => {
    if (article.id !== id) return article;
    article.favorite = true;
    return article;
  });
};
