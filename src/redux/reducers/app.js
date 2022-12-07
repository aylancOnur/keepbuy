import * as constants from '../constants';

const initialState = {
  cart: [],
  username: 'onur@example.com',
  password: '123456',

  userInfo: {},

  loginStatus: false,
  loginLoading: false,

  products: {
    list: [],
    limit: 0,
    total: 0,
    skip: 0,
  },
};

export const app = (state = initialState, {type, payload, key, value}) => {
  switch (type) {
    case constants.SET_APP: {
      return {...state, [key]: value};
    }

    case constants.REQUEST_LOGIN_USER_WITH_FB:
    case constants.REQUEST_CREATE_USER_WITH_FB:
    case constants.REQUEST_LOGIN: {
      console.log('LOGIN', payload);

      return {
        ...state,
        password: undefined,
        userInfo: payload.userInfo,
        loginStatus: true,
      };
    }

    case constants.REQUEST_LOGOUT_USER_WITH_FB: {
      console.log('logout reducer');

      return {
        ...state,
        loginStatus: false,
      };
    }

    case constants.REQUEST_GET_ALL_PRODUCTS: {
      return {
        ...state,
        products: {
          limit: payload.limit,
          total: payload.total,
          skip: payload.skip,
          list: payload.products,
        },
      };
    }

    case constants.REQUEST_GET_PRODUCTS_FB: {
      return {
        ...state,
        cart: payload,
      };
    }

    case constants.FIREBASE_PRODUCTS_LISTENER: {
      return {
        ...state,
      };
    }

    case constants.REQUEST_GET_FAVORITES_FB: {
      console.log('PAYLOAD', payload);
      return {
        ...state,
        fbFavorites: payload,
      };
    }

    case constants.FIREBASE_FAVORITES_LISTENER: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
};
