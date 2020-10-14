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

    default:
      return state;
  }
}

const markFavoriteNews = (id, articles) => {
  return articles.map((article) => {
    if (article.id !== id) return article;
    article.favorite = article.favorite ? !article.favorite : true;
    return article;
  });
};