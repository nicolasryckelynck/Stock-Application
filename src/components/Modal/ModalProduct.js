import React from "react";
import {Image, Modal, Pressable, Text, TextInput, View} from "react-native";

import {styles} from "../../styles/style";
import {abortEanChange} from "../Alert/abortEanChange";

export const ModalProduct = ({
  setModalVisible,
  modalVisible,
  selectedProduct,
  tmpEAN,
  setTmpEAN,
  handleValidation,
  handleItemNotScannable,
  updatedEan,
  handleCloseModal,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {selectedProduct?.ProductName} {selectedProduct?.DeclinaisonName}
        </Text>
        <Image
          source={{uri: selectedProduct?.ImageUrl}}
          style={styles.modalImage}
        />
        <Text style={[styles.productInfo, {textAlign: "center"}]}>
          UPC: {selectedProduct?.Upc2}
        </Text>
        <Text style={[styles.productInfo, {textAlign: "center"}]}>
          EAN existant: {selectedProduct?.Ean13}
        </Text>

        <TextInput
          style={[
            styles.inputBarCode,
            {
              marginVertical: 20,
              borderColor: "black",
              borderWidth: 3,
              height: 50,
            },
          ]}
          placeholder="Scanner un code barre"
          value={tmpEAN}
          onChangeText={(text) => setTmpEAN(text)}
          returnKeyType="done"
        />
        {tmpEAN.length >= 5 && (
          <Pressable
            onPress={() => handleValidation()}
            style={styles.validateButton}
          >
            <Text style={styles.validateText}>Mettre à jours</Text>
          </Pressable>
        )}
        <View style={styles.bottomButtonsContainer}>
          <Pressable
            style={styles.notScannableButton}
            onPress={() => handleItemNotScannable()}
          >
            <Text style={styles.notScannableText}>Impossible à scanner</Text>
          </Pressable>

          {updatedEan && (
            <Pressable
              onPress={() => {
                abortEanChange(selectedProduct, tmpEAN);
                handleCloseModal();
              }}
              style={[
                styles.returnButton,
                {
                  height: "50%",
                  top: 0,
                  backgroundColor: "red",
                  borderColor: "red",
                  borderRadius: 5,
                },
              ]}
            >
              <Text style={styles.returnText}>ANNULER EAN</Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={() => {
            handleCloseModal();
          }}
          style={styles.modalCloseButton}
        >
          <Text style={styles.modalCloseButtonText}>Fermer</Text>
        </Pressable>
      </View>
    </Modal>
  );
};
