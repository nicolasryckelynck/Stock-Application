import React, {useEffect, useState} from "react";
import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import {styles} from "../styles/style";
import {abortEanChange} from "./Alert/abortEanChange";
import {getScanNumber} from "../api/getScanNumber";

export const UpdateEanEnterEan = ({
  apiSwitch,
  setApiSwitch,
  updateUpc,
  productData1,
  handleUpcValidation,
  upcUpdated,
  handleValidation,
  rsetUpdateEanMenuElements,
  returnToMenu,
  tmpEAN,
  setTmpEAN,
  validateEan,
  setValidateEan,
  setProductData1,
}) => {
  const [numberScan, setNumberScan] = useState(0);

  useEffect(() => {
    getScanNumber(setNumberScan);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.scannerView}
    >
      <Text style={styles.upcText}>
        Rentrer un code UPC ({numberScan} produits scannés)
      </Text>
      <Text style={[styles.headerTitle, {color: "#ff9e1f"}]}>
        Liste des produits non scannés
      </Text>
      <Switch
        style={{
          transform: [{scaleX: 1.5}, {scaleY: 1.5}],
        }}
        value={apiSwitch}
        onValueChange={(value) => setApiSwitch(value)}
        trackColor={{false: "#fff", true: "#fff"}}
        thumbColor={apiSwitch ? "#ff9e1f" : "#ff9e1f"}
        ios_backgroundColor="#ff9e1f"
      />
      <TextInput
        keyboardType="numeric"
        style={[styles.inputBarCode, {marginVertical: 30, height: 50}]}
        placeholder="Rentrer un code UPC"
        value={upcUpdated}
        onChangeText={(newUpc) => updateUpc(newUpc)}
        returnKeyType="done"
      />
      {Object.keys(productData1).length > 0 &&
        !productData1.hasOwnProperty("error3") && (
          <View style={styles.productInfoUpdateEanMenu}>
            <Text style={styles.ean}>EAN: {productData1["Ean13"]}</Text>
            <Text style={styles.ean}>EAN: {productData1["Upc2"]}</Text>
            <Image
              source={{uri: productData1["ImageUrl"]}}
              style={styles.productMatchImageInventory}
            />
            <Text
              style={[
                styles.productMatchTitle,
                {
                  color: "#ff9e1f",
                  fontSize: 16,
                },
              ]}
            >
              {productData1["ProductName"]} - {productData1["DeclinaisonName"]}
            </Text>
          </View>
        )}
      {!Object.keys(productData1).length > 0 && (
        <Pressable onPress={handleUpcValidation} style={styles.validateButton}>
          <Text style={styles.validateText}>Valider</Text>
        </Pressable>
      )}
      {upcUpdated &&
        Object.keys(productData1).length > 0 &&
        !productData1.hasOwnProperty("error3") && (
          <TextInput
            style={[styles.inputBarCode, {marginVertical: 20, height: 50}]}
            placeholder="Scanner un code barre"
            value={tmpEAN}
            onChangeText={(text) => setTmpEAN(text)}
            returnKeyType="done"
          />
        )}
      {upcUpdated &&
        Object.keys(productData1).length > 0 &&
        !productData1.hasOwnProperty("error3") &&
        tmpEAN.length >= 5 && (
          <Pressable onPress={handleValidation} style={styles.validateButton}>
            <Text style={styles.validateText}>Valider</Text>
          </Pressable>
        )}

      <View style={styles.bottomButtonsContainer}>
        <Pressable
          onPress={() => rsetUpdateEanMenuElements()}
          style={styles.resetButton}
        >
          <Text style={styles.returnText}>VIDER</Text>
        </Pressable>
        {validateEan && (
          <Pressable
            onPress={() => {
              abortEanChange(productData1, tmpEAN);
              setValidateEan(false);
              setProductData1([]);
              setTmpEAN("");
            }}
            style={[styles.returnButton, styles.abortEanButton]}
          >
            <Text style={styles.returnText}>ANNULER EAN</Text>
          </Pressable>
        )}
      </View>
      <Pressable
        onPress={() => returnToMenu()}
        style={[styles.returnButton, {top: 0}]}
      >
        <Text style={styles.returnText}>Retour</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
};
