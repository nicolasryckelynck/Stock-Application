import React, {useEffect, useState} from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Switch,
  Text,
  View,
} from "react-native";

import {styles} from "../styles/style";

import {addRecord} from "../api/addRecord";
import {updateEan} from "../api/updateEan";
import {getProductInfoByUPC} from "../api/getProductInfoByUPC";

import {ModalProduct} from "./Modal/ModalProduct";
import {showAlert} from "./Alert/showAlert";

export const ProductListElements = ({
  productInformationsList,
  apiSwitch,
  setApiSwitch,
  optionSelected,
  employeSelected,
}) => {
  const [data, setData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [sortedList, setSortedList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tmpEAN, setTmpEAN] = useState("");
  const [updatedEan, setUpdatedEan] = useState(false);

  // receive product list from api and sort it by UPC ASC
  useEffect(() => {
    if (productInformationsList) {
      const sortedListTmp = [...productInformationsList];

      sortedListTmp.sort((a, b) => {
        const upcA = a.Upc2 || "";
        const upcB = b.Upc2 || "";

        return upcA.localeCompare(upcB, "en", {
          numeric: true,
          sensitivity: "base",
        });
      });
      setSortedList(sortedListTmp);
      setData(sortedListTmp.slice(0, 10));
    }
  }, [productInformationsList]);

  // handle end of list by adding 10 more items
  const handleEndReached = () => {
    setIsLoadingMore(true);

    const currentLength = data.length;
    const newData = sortedList.slice(currentLength, currentLength + 10);

    setData((prevData) => [...prevData, ...newData]);
    setIsLoadingMore(false);
  };

  // handle click on a product
  const handleProductList = (item) => {
    setSelectedProduct(item);
    setModalVisible(true);
  };

  // update list after adding a record
  const updateList = (itemToRemove) => {
    setData((prevData) =>
      prevData.filter(
        (item) => item.DeclinaisonId !== itemToRemove.DeclinaisonId
      )
    );
    setSortedList((prevList) =>
      prevList.filter(
        (item) => item.DeclinaisonId !== itemToRemove.DeclinaisonId
      )
    );
  };

  // check if EAN is already existing
  const eanChecker = () => {
    if (selectedProduct["Ean13"]) {
      if (tmpEAN === selectedProduct["Ean13"]) {
        Alert.alert(
          selectedProduct["ProductName"] +
            " - " +
            selectedProduct["DeclinaisonName"],
          "EAN déjà existant"
        );
        setTmpEAN("");
        selectedProduct([]);
        return true;
      } else return false;
    }
  };

  // handle item too not scannable
  const handleItemNotScannable = () => {
    if (!eanChecker() && !selectedProduct["Ean13"]) {
      addRecord({
        productData1: selectedProduct,
        productData2: [],
        textEan: "",
        optionSelected,
        employeSelected,
        status: 1,
      });
      updateList(selectedProduct);
      setSelectedProduct(null);
      setTmpEAN("");
      setModalVisible(false);
    } else {
      Alert.alert("Erreur", "EAN déjà existant");
    }
  };

  // update EAN in database
  const handleValidation = () => {
    if (tmpEAN.length >= 5) {
      addRecord({
        productData1: selectedProduct,
        productData2: [],
        textEan: tmpEAN,
        optionSelected,
        employeSelected,
        status: 0,
      });
      updateEan({productData1: selectedProduct, textEan: tmpEAN});
      updateList(selectedProduct);
      setTmpEAN(selectedProduct["Ean13"]);
      setUpdatedEan(true);
      getProductInfoByUPC({
        upc: selectedProduct["Upc2"],
        setProductData1: setSelectedProduct,
      });
    }
  };

  // close modal product
  const handleCloseModal = () => {
    showAlert(
      "Confirmation",
      "Êtes-vous sûr de vouloir fermer cette page produit",
      () => {
        setModalVisible(!modalVisible);
        setSelectedProduct(null);
        setTmpEAN("");
        setUpdatedEan(false);
      }
    );
  };

  // each item of the list
  const MemoizedItem = React.memo(
    ({item}) => (
      <Pressable
        onPress={() => handleProductList(item)}
        style={styles.itemProduct}
      >
        <Image source={{uri: item.ImageUrl}} style={styles.imageProductList} />
        <View style={{display: "flex", flexDirection: "column"}}>
          <Text style={[styles.productInfo, {color: "#ff9e1f"}]}>
            {item.ProductName} {item.DeclinaisonName}
          </Text>
          <Text style={[styles.productInfo, {color: "red"}]}>
            UPC: {item.Upc2}
          </Text>
          <Text style={[styles.productInfo, {color: "#436B92"}]}>
            EAN: {item.Ean13}
          </Text>
        </View>
      </Pressable>
    ),
    (prevProps, nextProps) => {
      return prevProps.item.Upc2 === nextProps.item.Upc2;
    }
  );

  const renderItem = ({item}) => <MemoizedItem item={item} />;

  return (
    <View
      style={{display: "flex", justifyContent: "center", alignItems: "center"}}
    >
      <View style={styles.listProductContainer}>
        <Text style={styles.headerTitle}>Produits non scannés</Text>
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
      </View>
      <FlatList
        style={{flex: 1}}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoadingMore && (
            <Text style={styles.loadingMore}>Loading more...</Text>
          )
        }
      />
      {modalVisible && (
        <ModalProduct
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          selectedProduct={selectedProduct}
          tmpEAN={tmpEAN}
          setTmpEAN={setTmpEAN}
          handleValidation={handleValidation}
          handleItemNotScannable={handleItemNotScannable}
          updatedEan={updatedEan}
          handleCloseModal={handleCloseModal}
        />
      )}
      <View style={{height: "10%"}} />
    </View>
  );
};
