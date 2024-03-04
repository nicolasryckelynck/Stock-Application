import {Alert, View} from "react-native";
import React, {useEffect, useState} from "react";

import {getProductInfoByUPC} from "../api/getProductInfoByUPC";
import {addRecord} from "../api/addRecord";
import {updateEan} from "../api/updateEan";
import {getProductInformationsList} from "../api/getProductInformationsList";

import {ProductListElements} from "./productListElements";
import {UpdateEanEnterEan} from "./updateEanEnterEan";

export const UpdateEanMenu = ({
  styles,
  upcUpdated,
  textEan,
  handleTextInputChange,
  resetScan,
  updateUpc,
  productData1,
  setProductData1,
  employeSelected,
  optionSelected,
  setUpcUpdated,
}) => {
  const [tmpEAN, setTmpEAN] = useState("");
  const [apiSwitch, setApiSwitch] = useState(false);
  const [productInformationsList, setProductInformationsList] = useState([]);
  const [validateEan, setValidateEan] = useState(false);

  // receive product list from api and sort it by UPC ASC
  useEffect(() => {
    if (apiSwitch) {
      getProductInformationsList(setProductInformationsList);
    }
  }, [apiSwitch]);

  const showAlert = (title, message, actions, options = {cancelable: true}) => {
    Alert.alert(title, message, actions, options);
  };

  // return to main menu
  const returnToMenu = () => {
    resetScan();
  };

  const eanChecker = () => {
    if (tmpEAN === productData1["Ean13"]) {
      Alert.alert(
        productData1["ProductName"] + " - " + productData1["DeclinaisonName"],
        "EAN déjà existant"
      );
      setTmpEAN("");
      setProductData1([]);
      return true;
    } else return false;
  };

  // update EAN
  const handleValidation = () => {
    if (tmpEAN.length > 5) {
      if (!eanChecker()) {
        addRecord({
          productData1,
          productData2: [],
          textEan: tmpEAN,
          optionSelected,
          employeSelected,
          upcUpdated,
          status: 0,
        });
        updateEan({productData1, textEan: tmpEAN});
        setValidateEan(true);
        setTmpEAN(productData1["Ean13"]);
        getProductInfoByUPC({upc: upcUpdated, setProductData1});
        setUpcUpdated("");
      }
    }
  };
  // receive product informations from api
  const handleUpcValidation = () => {
    if (upcUpdated.length > 0) {
      getProductInfoByUPC({upc: upcUpdated, setProductData1});
    }
  };

  // reset EAN menu elements
  const rsetUpdateEanMenuElements = () => {
    setTmpEAN("");
    setProductData1([]);
    updateUpc("");
  };

  const updateEanEnterMenuProps = {
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
  };

  return (
    <View style={styles.scannerView}>
      {!apiSwitch ? (
        <UpdateEanEnterEan {...updateEanEnterMenuProps} />
      ) : (
        <View>
          {Object.keys(productInformationsList).length > 0 &&
            productInformationsList && (
              <ProductListElements
                productInformationsList={productInformationsList.result}
                apiSwitch={apiSwitch}
                setApiSwitch={setApiSwitch}
                optionSelected={optionSelected}
                employeSelected={employeSelected}
              />
            )}
        </View>
      )}
    </View>
  );
};
