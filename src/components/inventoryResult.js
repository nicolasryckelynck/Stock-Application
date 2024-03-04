import {Alert, Image, Text, TouchableOpacity, View} from "react-native";

import ModalStock from "../modal/modal";

export const InventoryResult = ({
  styles,
  productData1,
  setEnableModal,
  enableModal,
  resetScan,
}) => {
  const handleValidation = () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de retourner en arrière ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Valider",
          onPress: () => {
            resetScan();
          },
        },
      ],
      {cancelable: true}
    );
  };
  return (
    <View style={styles.containerInventory}>
      <Image
        source={{uri: productData1["ImageUrl"]}}
        style={styles.productMatchImageInventory}
      />
      <Text
        style={[
          styles.productMatchTitle,
          {
            color: "#436B92",
            fontSize: 25,
          },
        ]}
      >
        {productData1["ProductName"]} - {productData1["DeclinaisonName"]}
      </Text>
      <Text
        style={[
          styles.productInformatios,
          styles.setVerticalBorder,
          {backgroundColor: "black", color: "#fff"},
        ]}
      >
        UPC: {productData1["Upc2"]}
      </Text>
      <Text
        style={[
          styles.productInformatios,
          styles.setVerticalBorder,
          {backgroundColor: "red", color: "#fff"},
        ]}
      >
        Quantité: {productData1["Quantity"]} unités
      </Text>
      <Text
        style={[
          styles.productInformatios,
          {backgroundColor: "#DFE9F5", color: "black"},
        ]}
      >
        DLUO: {productData1["expiryDate"]}
      </Text>
      <TouchableOpacity
        onPress={() => setEnableModal(!enableModal)}
        style={styles.updateInfoButton}
      >
        <Text style={[styles.btnScanText, {paddingVertical: 13}]}>
          Mettre à jours les informations
        </Text>
      </TouchableOpacity>
      {enableModal && (
        <ModalStock
          setEnableModal={setEnableModal}
          enableModal={enableModal}
          id_product={productData1["id_product"]}
          id_productAttribute={productData1["DeclinaisonId"]}
          productData1={productData1}
        />
      )}
      <TouchableOpacity style={styles.btnScanOther} onPress={handleValidation}>
        <Text style={styles.btnScanText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
};
