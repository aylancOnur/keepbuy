import * as constants from '../constants';

import * as auth from '../../api/auth';

import * as products from '../../api/products';
import * as favorites from '../../api/favorites';

export const setApp = (key, value) => ({type: constants.SET_APP, key, value});

export const requestLogin = payload => async (dispatch, getState) => {
  const {username, password} = getState().app;

  dispatch({type: constants.SET_APP, key: 'loginLoading', value: true});

  const {data, success} = await auth.login(username, password);

  dispatch({type: constants.SET_APP, key: 'loginLoading', value: false});

  if (success) {
    dispatch({
      type: constants.REQUEST_LOGIN,
      payload: {
        userInfo: {
          email: data.email,
          firstName: data.firstName,
          image: data.image,
        },
      },
    });
  } else {
  }
};

export const loginUserWithFB = payload => async (dispatch, getState) => {
  //async işlemlerin yapılacağı yer
  const {username, password} = getState().app;

  dispatch({type: constants.SET_APP, key: 'loginLoading', value: true});

  const {data, success} = await auth.loginUserWithFB(username, password);

  dispatch({type: constants.SET_APP, key: 'loginLoading', value: false});

  if (success) {
    dispatch({
      type: constants.REQUEST_CREATE_USER_WITH_FB,
      payload: {userInfo: data},
    });
  } else {
  }
};

export const createUserWithFB = payload => async (dispatch, getState) => {
  //async işlemlerin yapılacağı yer
  const {username, password} = getState().app;

  dispatch({type: constants.SET_APP, key: 'loginLoading', value: true});

  const {data, success} = await auth.createUserWithFB(username, password);

  dispatch({type: constants.SET_APP, key: 'loginLoading', value: false});

  if (success) {
    dispatch({
      type: constants.REQUEST_CREATE_USER_WITH_FB,
      payload: {userInfo: data},
    });
  } else {
  }
};

export const requestAllProducts = payload => async (dispatch, getState) => {
  const {data, success} = await products.getAllProducts();

  if (success) {
    dispatch({
      type: constants.REQUEST_GET_ALL_PRODUCTS,
      payload: data,
    });
  } else {
  }
};

export const requestAddProductToFirebase =
  payload => async (dispatch, getState) => {
    const {userInfo} = getState().app;
    // console.log('STATEEEEEE', getState().app.fbProducts);
    const {data, success} = await products.addProductToFirebase(
      payload,
      userInfo.user.uid,
    );
    console.log('requestAddProductToFirebase', data);
    if (success) {
      dispatch({
        type: constants.REQUEST_ADD_PRODUCT_FB,
        payload: data,
      });
    } else {
    }
  };

export const requestRemoProductFromFirebase =
  (key, value) => async (dispatch, getState) => {
    const {userInfo} = getState().app;
    const {data, success} = await products.removeProductFromFirebase(
      key,
      value,
      userInfo.user.uid,
    );

    if (success) {
      dispatch({
        type: constants.REQUEST_REMOVE_PRODUCT_FB,
        payload: data,
      });
    } else {
    }
  };

export const requestGetAllPRoductsFromFirebase =
  payload => async (dispatch, getState) => {
    const {userInfo} = getState().app;

    const {data, success} = await products.getAllPRoductsFromFirebase(
      userInfo.user.uid,
    );

    if (success) {
      dispatch({
        type: constants.REQUEST_GET_PRODUCTS_FB,
        payload: data,
      });
    } else {
    }
  };

export const firebaseProductsListener =
  payload => async (dispatch, getState) => {
    const {userInfo} = getState().app;

    const {off, data, success} = await products.firebaseProductsListener(
      userInfo.user.uid,
      d => {
        //burada bir filtreleme yapılabilir, tüm datayı yeniden çekmek yerine sadece yeni değişiklikler belirlenip tek tek sadece yeni eklenen datalar çekilebilir
        //amaç çalışma mantığını anlamak olduğu için şimdilik göz ardı edebiliriz
        //firebase benzeri cloud çözümlerinde sunucu taraflı performansla ilgili bir endişemiz olmadığı için tekrarlı requestler problem oluşturmaz ancak ağ performansından dolayı verileri geç gelecektir
        //yine de realtime database yerine collections kullarak bunun önüne geçmek gerekir (koleksiyonlar, karmaşık sorgular oluşturmamızı kolaylaştırır ve daha çok seçenek sunar)

        //realtime database karmaşık veri ilişkileri olan, n-n ve ya 1-n gibi ilişkileri olan verilerle başa çıkmada yetersizdir

        //özellikle x kullanıcısına ait y verileri ya da y verisine sahip x kullanıcıları tarzı sorgular çok yavaş çalışır

        // burada kullanıcı verisi takip ediliyor ve yapılan her değişiklikte kullanıcıya ait tüm veri baştan çekiliyor
        dispatch(requestGetAllPRoductsFromFirebase());
      },
    );

    if (success) {
      dispatch({
        type: constants.FIREBASE_PRODUCTS_LISTENER,
        payload: off,
      });
    } else {
    }
  };

export const requestAddFavoriteToFirebase =
  payload => async (dispatch, getState) => {
    const {userInfo} = getState().app;
    // console.log('STATEEEEEE', getState().app.fbProducts);
    const {data, success} = await favorites.addFavoriteToFirebase(
      payload,
      userInfo.user.uid,
    );

    if (success) {
      dispatch({
        type: constants.REQUEST_ADD_FAVORITE_FB,
        payload: data,
      });
    } else {
    }
  };

export const requestRemoveFavoriteFromFirebase =
  productId => async (dispatch, getState) => {
    const {userInfo} = getState().app;
    const {data, success} = await favorites.removeFavoriteFromFirebase(
      userInfo.user.uid,
    );

    if (success) {
      dispatch({
        type: constants.REQUEST_REMOVE_FAVORITE_FB,
        payload: data,
      });
    } else {
    }
  };

export const requestGetAllFavoritesFromFirebase =
  payload => async (dispatch, getState) => {
    const {userInfo} = getState().app;

    const {data, success} = await favorites.getAllFavoritesFromFirebase(
      userInfo.user.uid,
    );

    if (success) {
      dispatch({
        type: constants.REQUEST_GET_FAVORITES_FB,
        payload: data,
      });
    } else {
    }
  };

export const firebaseFavoritesListener =
  payload => async (dispatch, getState) => {
    const {userInfo} = getState().app;

    const {off, data, success} = await favorites.firebaseFavoritesListener(
      userInfo.user.uid,
      d => {
        dispatch(requestGetAllFavoritesFromFirebase());
      },
    );

    if (success) {
      dispatch({
        type: constants.FIREBASE_FAVORITES_LISTENER,
        payload: off,
      });
    } else {
    }
  };
