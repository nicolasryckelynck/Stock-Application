import React,{useState,useEffect} from "react";
import {
    Text,
    View,
    Modal,
    Pressable,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";

import {styles} from "./modalStyle";

import {updateStock} from "../api/updateStock";
import {updateDluo} from "../api/updateDluo";

export default function ModalStock({
                                       setEnableModal,
                                       enableModal,
                                       id_product,
                                       id_productAttribute,
                                       productData1,
                                   }) {
    const [stockValue,setStockValue] = useState("");
    const [selectedDate,setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        console.log("TEST")
        setSelectedDate(new Date(date));
    };

    useEffect(() => {
        console.log("test")
        setStockValue(productData1["Quantity"]);
    },[]);

    const handleUpdateValidation = () => {
        Alert.alert(
            "Confirmation",
            "Etes vous sûr de vouloir effectuer la mise à jours ?",
            [
                {
                    text:"Cancel",
                    style:"cancel",
                },
                {
                    text:"OK",
                    onPress:() => {
                        stockValue !== ""
                            ? updateStock(
                                stockValue,
                                id_product,
                                id_productAttribute,
                                setEnableModal
                            )
                            : setEnableModal(false);
                        selectedDate
                            ? updateDluo(
                                selectedDate,
                                id_product,
                                id_productAttribute,
                                setEnableModal
                            )
                            : setEnableModal(false);
                    },
                },
            ],
            {cancelable:false}
        );
    };

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={enableModal}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setEnableModal(false);
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.centeredView}
                >
                    <View style={styles.modalView}>
                        <Pressable
                            style={styles.closeModalButton}
                            onPress={() => setEnableModal(false)}
                        >
                            <Text style={{color:"white"}}>Fermer</Text>
                        </Pressable>
                        <Text style={styles.modalText}>Mettre à jour le stock</Text>
                        <TextInput
                            style={styles.input}
                            value={stockValue}
                            onChangeText={(text) => setStockValue(text)}
                            placeholder="Quantité totale du stock"
                            placeholderTextColor={"#fff"}
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                        <Text style={styles.modalText}>Mettre à jour la DLUO</Text>
                        <CalendarPicker
                            onDateChange={(date) => handleDateChange(date)}
                            selectedDayColor="#ff9e1f"
                            selectedDayTextColor="#fff"
                            selectedStartDate={productData1["expiryDate"]}
                            initialDate={productData1["expiryDate"] ? productData1["expiryDate"] : new Date()}
                            textStyle={styles.calendarTextStyle}
                            customDatesStyles={(date) => {
                                return {
                                    container:{
                                        backgroundColor:"#fff",
                                    },
                                    text:{
                                        color:"#000",
                                    },
                                };
                            }}
                        />

                        <Pressable
                            style={styles.closeModalButton}
                            onPress={handleUpdateValidation}
                        >
                            <Text style={styles.textStyle}>Mettre à jour</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
