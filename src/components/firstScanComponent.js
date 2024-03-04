import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, {useState} from "react";
import {BarCodeScanner} from "expo-barcode-scanner";

export const FirstScanComponent = ({
  optionSelected,
  styles,
  handleTextInputChange,
  resetScan,
}) => {
  const [tmpEAN, setTmpEAN] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  // handle validation of the scanned EAN
  const handleValidation = () => {
    if (tmpEAN.length >= 5) {
      handleTextInputChange(tmpEAN);
    }
  };

  // handle barcode scanned
  const handleBarCodeScanned = ({type, data}) => {
    setTmpEAN(data);
    setCameraActive(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.scannerView}
    >
      {optionSelected !== 0 && (
        <View>
          <Text style={styles.titlefirsStep}>Scanner un code barre</Text>
        </View>
      )}
      <Pressable
        onPress={() => setCameraActive(!cameraActive)}
        style={styles.activateCameraButton}
      >
        <Text style={styles.activateCameraText}>
          {cameraActive ? "Désactiver" : "Activer"} caméra
        </Text>
      </Pressable>
      {cameraActive && (
        <View style={styles.cameraView}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      )}
      {!cameraActive && (
        <View style={styles.cameraNotActiveContainer}>
          <TextInput
            style={[styles.inputBarCode, {height: 50}]}
            placeholder="Scanner un code barre"
            value={tmpEAN}
            onChangeText={(text) => setTmpEAN(text)}
            returnKeyType="done"
          />
          <Pressable
            onPress={handleValidation}
            style={[styles.validateButton, {marginTop: 20, height: "20%"}]}
          >
            <Text style={styles.validateText}>Valider</Text>
          </Pressable>

          <Pressable
            onPress={() => resetScan()}
            style={[styles.returnButton, {height: "20%"}]}
          >
            <Text style={styles.returnText}>Retour</Text>
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};
