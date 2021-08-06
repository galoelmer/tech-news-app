import {
  SET_NEWS_DATA,
  MARK_FAVORITE_NEWS,
  UNMARK_FAVORITE_NEWS,
  UNMARK_SINGLE_FAVORITE_NEWS,
  INCREASE_NEWS_DATA_OFFSET,
  CHECK_ALL_FAVORITE_NEWS,
  LOADING_DATA,
} from "../types";

const initialState = {
  articles: [],
  loading: false,
  maxLimit: false,
  offset: 0,
};

export default function newsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NEWS_DATA:
      return {
        ...state,
        articles: [...state.articles, ...action.payload.data],
        loading: false,
        maxLimit: action.payload.maxLimit,
      };

    case INCREASE_NEWS_DATA_OFFSET:
      return {
        ...state,
        offset: state.offset + 12,
      };

    case CHECK_ALL_FAVORITE_NEWS:
      return Object.assign({}, state, { articles: markAllFavoritesNews(action.payload, state.articles) });

    case MARK_FAVORITE_NEWS:
      return Object.assign({}, state, {
        articles: markFavoriteNews(action.payload, state.articles),
      });

    case UNMARK_FAVORITE_NEWS: // uncheck all favorite articles after user logout
      return Object.assign({}, state, {
        articles: state.articles.map((article) => {
          if (!article.hasOwnProperty("favorite")) return article;
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

// Check single article to user favorite News
const markFavoriteNews = (id, articles) => {
  return articles.map((article) => {
    if (article.id !== id) return article;
    article.favorite = true;
    return article;
  });
};

// Check all articles for favorites
const markAllFavoritesNews = (userFavorites, currentNews) => {
  const favoritesId = userFavorites.map((item) => item.articleId);
  return currentNews.map((item) => {
    if (favoritesId.includes(item.id)) {
      item.favorite = true;
    } 
    return item;
  });
};
