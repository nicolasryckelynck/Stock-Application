import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkTokenValidity = async (token,dispatch) => {
  const expirationDate = await AsyncStorage.getItem("expirationDate");
  if (!token || !expirationDate) return null;
  if (new Date(expirationDate) <= new Date()) {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("expirationDate");
    dispatch({type:"LOGOUT"});
    return null;
  }
  return token;
};
