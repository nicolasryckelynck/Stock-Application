import AsyncStorage from "@react-native-async-storage/async-storage";

export const removeToken = async (dispatch) => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("expirationDate");
  dispatch({type: "LOGOUT"});
  return null;
};
