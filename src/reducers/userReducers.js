import {
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  SET_USER,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
  UPDATE_USERNAME,
} from '../types';

const initialState = {
  authenticated: false,
  name: '',
  favorites: [],
  randomNameCreated: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true,
      };
    case SET_UNAUTHENTICATED:
      return initialState;

    case SET_USER:
      return {
        authenticated: true,
        name: action.payload.userName,
        id: action.payload.userId,
        favorites: action.payload.favorites,
        randomNameCreated: action.payload.randomNameCreated,
      };

    case UPDATE_USERNAME:
      return {
        ...state,
        name: action.payload,
        randomNameCreated: false,
      };

    case ADD_TO_FAVORITES:
      return { ...state, favorites: [...state.favorites, action.payload] };

    case REMOVE_FROM_FAVORITES:
      return {
        ...state,
        favorites: state.favorites.filter(
          (item) => item.articleId !== action.payload
        ),
      };

    default:
      return state;
  }
}
