import React, {useEffect, useState} from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  getRestockingOrders,
  getRestockingOrdersByEan,
} from "../api/getRestockingOrders";
import {styles} from "../styles/style";
import {RestockOrderContent} from "./restockOrdeContent";
import {BarCodeScanner} from "expo-barcode-scanner";
import {AntDesign} from "@expo/vector-icons";

export const RestockingMenu = ({resetScan, employeSelected}) => {
  const [restockingOrders, setRestockingOrders] = useState([]);
  const [restockingOrdersByEan, setRestockingOrdersByEan] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cameraVisible, setCameraVisible] = useState(false);
  const [ean, setEan] = useState("");
  const [productScannedInformations, setProductScannedInformations] = useState(
    []
  );
  const [eanMode, setEanMode] = useState(false);

  // get all restocking orders
  useEffect(() => {
    getRestockingOrders(setRestockingOrders);
  }, []);

  // filter orders by id or title in searchBar
  const filteredOrders = restockingOrders.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toString().includes(searchTerm.toLowerCase())
  );

  // get all orders wich contain the product with the ean scanned
  const handleBarCodeScanned = (data) => {
    if (data) {
      setEan(data.data);
      getRestockingOrdersByEan(
        setRestockingOrdersByEan,
        data.data,
        setProductScannedInformations,
        setSelectedProduct
      );
      setCameraVisible(false);
    }
  };

  // unset elements
  const unsetElements = () => {
    setSearchTerm("");
    setCameraVisible(false);
    setRestockingOrdersByEan([]);
    setProductScannedInformations([]);
    setEan("");
  };

  useEffect(() => {
    if (eanMode && searchTerm.length > 5) {
      setEan(searchTerm);
      getRestockingOrdersByEan(
        setRestockingOrdersByEan,
        searchTerm,
        setProductScannedInformations,
        setSelectedProduct
      );
      setCameraVisible(false);
    }
  }, [searchTerm]);

  return (
    <View style={styles.restockingMenuContainer}>
      {!selectedProduct ? (
        <View style={styles.restockingMenuContainer}>
          <View style={styles.header}>
            <Text style={styles.titleHeader}>Réassort</Text>
            <Text style={styles.nbrOrder}>
              {searchTerm.length > 0
                ? filteredOrders.length
                : restockingOrdersByEan.length > 0
                ? restockingOrdersByEan.length
                : restockingOrders.length}{" "}
              commandes
            </Text>
          </View>
          <KeyboardAvoidingView
            style={styles.filterPart}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Pressable onPress={() => setEanMode(!eanMode)}>
              <Text
                style={[
                  styles.EANbutton,
                  {backgroundColor: eanMode ? "red" : "#ff9e1f"},
                ]}
              >
                EAN
              </Text>
            </Pressable>
            <TextInput
              style={styles.searchInput}
              placeholder={
                !eanMode ? "Rechercher par ID ou titre" : "Rechercher par EAN"
              }
              placeholderTextColor="#fff"
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
              }}
            />
            {searchTerm.length > 0 && (
              <Pressable onPress={() => unsetElements()}>
                <Text style={styles.Xbutton}>X</Text>
              </Pressable>
            )}
            <Pressable onPress={() => setCameraVisible(!cameraVisible)}>
              <AntDesign name="barcode" size={50} color="white" />
            </Pressable>
          </KeyboardAvoidingView>

          {cameraVisible ? (
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={StyleSheet.absoluteFillObject}
            />
          ) : (
            // display orders list
            <View style={styles.flatlistContainer}>
              <FlatList
                data={
                  searchTerm.length > 0
                    ? filteredOrders
                    : restockingOrdersByEan.length > 0
                    ? restockingOrdersByEan
                    : restockingOrders
                }
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({item}) => (
                  <Pressable
                    style={[
                      productScannedInformations.length !== 0
                        ? styles.eachOrderRestocking
                        : styles.eachOrderRestocking2,
                    ]}
                    onPress={() => setSelectedProduct(item)}
                  >
                    <Text
                      style={
                        productScannedInformations.length !== 0
                          ? styles.titleOrderRestock
                          : styles.titleOrderRestock2
                      }
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.titleOrderRestock2}>{item.id}</Text>
                    {productScannedInformations.length !== 0 && (
                      <View
                        style={[
                          styles.headerDirection,
                          styles.productScannedInfoContainer,
                        ]}
                      >
                        <Image
                          source={{uri: productScannedInformations["ImageUrl"]}}
                          style={styles.productScannedImage}
                        />
                        <Text style={styles.productScannedName}>
                          {productScannedInformations["ProductName"]}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                )}
              />
            </View>
          )}
          <Pressable onPress={() => resetScan()} style={styles.goBackButton}>
            <Text style={styles.goBackText}>Retour</Text>
          </Pressable>
        </View>
      ) : (
        <RestockOrderContent
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          ean={ean}
          setEan={setEan}
        />
      )}
    </View>
  );
};
