import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Image,
  Alert,
} from "react-native";

import {styles} from "../../styles/style";
import CalendarPicker from "react-native-calendar-picker";

import {updateDluo} from "../../api/updateDluo";
import {updateStatus} from "../../api/updateStatus";

export const ModalProductRestocking = ({
  modalVisible,
  setModalVisible,
  selectedItem,
  setTotalProductNbr,
  selectedProduct,
}) => {
  const [notValidated, setNotValidated] = useState(false);
  const [realQuantity, setRealQuantity] = useState("");
  const [displayCalendar, setDisplayCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date));
  };

  const showAlert = (confirmationMessage, onPressOk) => {
    Alert.alert(
      "Confirmation",
      confirmationMessage,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: onPressOk,
        },
      ],
      {cancelable: false}
    );
  };
  const handleStockValidation = (stock_status) => {
    if (realQuantity !== "" && stock_status === 0) {
      showAlert("Voulez vous mettre à jours le stock ?", () => {
        updateStatus(
          selectedProduct.id_order,
          selectedItem?.ProductId,
          stock_status,
          selectedItem?.DeclinaisonId,
          selectedItem?.realQuantity
        );
        selectedItem.status = 1;
        setModalVisible(!modalVisible);
      });
    } else if (stock_status === 1) {
      showAlert("Voulez vous valider le stock ?", () => {
        updateStatus(
          selectedProduct.id_order,
          selectedItem?.ProductId,
          stock_status,
          selectedItem?.DeclinaisonId,
          selectedItem?.quantity_expected
        );
        selectedItem.status = 1;
        setModalVisible(!modalVisible);
      });
    } else {
      Alert.alert("Erreur", "Veuillez rentrer une quantité valide");
    }
  };

  const handleDluoUpdate = () => {
    if (selectedDate !== "") {
      showAlert("Voulez vous mettre à jours le stock ?", () => {
        updateDluo(
          selectedDate,
          selectedItem?.ProductId,
          selectedItem?.DeclinaisonId,
          setModalVisible
        );
        setDisplayCalendar(false);
      });
    } else {
      Alert.alert("Erreur", "Veuillez rentrer une date valide");
    }
  };

  const handleValidation = (status) => {
    switch (status) {
      case 1:
        setNotValidated(!notValidated);
        break;
      case 2:
        handleStockValidation(1);
        break;
    }
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalContainerProduct}>
        {!displayCalendar ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={[
              styles.modalContentProduct,
              {height: notValidated ? 550 : 500},
            ]}
          >
            <Image
              source={{uri: selectedItem?.ImageUrl}}
              style={[
                styles.imageProductSelected,
                {height: notValidated ? "25%" : "40%"},
              ]}
            />
            <Text style={styles.productInformationsModal}>
              {selectedItem?.ProductName} {selectedItem?.DeclinaisonName}
            </Text>
            {selectedItem?.expiryDate && (
              <Pressable
                onPress={() => {
                  setDisplayCalendar(true);
                  setSelectedDate(new Date(selectedItem?.expiryDate));
                }}
              >
                <Text
                  style={[styles.productInformationsModal, styles.dluoText]}
                >
                  {selectedItem?.expiryDate}
                </Text>
              </Pressable>
            )}
            <Text style={[styles.productInformationsModal, {color: "#ff9e1f"}]}>
              UPC: {selectedItem?.Upc2}
            </Text>
            <Text style={[styles.productInformationsModal, {color: "red"}]}>
              Qté: {selectedItem?.quantity_expected}
            </Text>

            <View style={styles.bottomButtonsContainer}>
              <Pressable
                onPress={() => handleValidation(1)}
                style={[styles.buttonQté, {backgroundColor: "red"}]}
              >
                <Text style={[styles.closeButtonText]}>NON valide</Text>
              </Pressable>
              <Pressable
                onPress={() => handleValidation(2)}
                style={[styles.buttonQté, {backgroundColor: "green"}]}
              >
                <Text style={styles.closeButtonText}>Valide</Text>
              </Pressable>
            </View>
            {notValidated && (
              <View style={styles.stockUpdateContainer}>
                <TextInput
                  style={styles.setQtyInput}
                  placeholder="Rentrer la quantité trouvée"
                  placeholderTextColor="#fff"
                  value={realQuantity}
                  keyboardType="numeric"
                  onChangeText={(text) => setRealQuantity(text)}
                  returnKeyType="done"
                />
                <Pressable
                  style={styles.stockButton}
                  onPress={() => handleStockValidation(0)}
                >
                  <Text style={styles.updateStockText}>Mettre à jours</Text>
                </Pressable>
              </View>
            )}
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.calendarView}>
            <CalendarPicker
              onDateChange={handleDateChange}
              selectedDayColor="#ff9e1f"
              selectedDayTextColor="#fff"
              selectedStartDate={selectedDate}
              initialDate={selectedDate}
              textStyle={styles.calendarTextStyle}
              customDatesStyles={(date) => {
                return {color: "#fff"};
              }}
            />
            <View style={styles.bottomButtonModalCalendar}>
              <Pressable
                style={styles.closeCalendarButton}
                onPress={() => {
                  setDisplayCalendar(false);
                  setSelectedDate("");
                }}
              >
                <Text style={styles.closeButtonText}>Fermer</Text>
              </Pressable>
              <Pressable
                style={styles.saveDluoCalendarButton}
                onPress={() => handleDluoUpdate()}
              >
                <Text style={styles.closeButtonText}>Sauvegarder DLUO</Text>
              </Pressable>
            </View>
          </View>
        )}
        <Pressable
          style={styles.closeButton}
          onPress={() => {
            setModalVisible(!modalVisible);
            setNotValidated(false);
            setTotalProductNbr("");
            setDisplayCalendar(false);
            setSelectedDate("");
          }}
        >
          <Text style={styles.closeButtonText}>Fermer</Text>
        </Pressable>
      </View>
    </Modal>
  );
};
