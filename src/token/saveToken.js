import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveToken = async (token) => {
  const expirationDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("expirationDate", expirationDate.toISOString());
};
