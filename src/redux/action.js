// cartActions.js
export const SET_TOKEN_LOGIN = "SET_TOKEN_LOGIN";

export const setTokenLogin = (token) => ({
  type: SET_TOKEN_LOGIN,
  payload: token,
});
