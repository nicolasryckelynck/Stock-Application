/**
 * @ Author: Nicolas Ryckelynck
 * @ Create Time: 2023-11-06 14:44:33
 * @ Modified by: Nicolas Ryckelynck
 * @ Modified time: 2024-03-04 21:25:54
 * @ Description:
 */

import {StatusBar} from "expo-status-bar";
import {StyleSheet, View} from "react-native";
import StockApplication from "./src/main";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {store, persistor} from "./src/redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <View style={styles.container}>
          <StockApplication />
          <StatusBar style="auto" />
        </View>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
