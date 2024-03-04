import React, {useEffect, useRef, useState} from "react";
import {
  Alert,
  Animated,
  Button,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

import {styles} from "../styles/style";

import {getOrderInformations} from "../api/getOrderInformations";
import {updateReassortStatus} from "../api/updateStatus";
import {updateStock} from "../api/updateStock";

import {ModalProductRestocking} from "./Modal/modalProductRestocking";

export const RestockOrderContent = ({
  selectedProduct,
  setSelectedProduct,
  ean,
  setEan,
}) => {
  const flatListRef = useRef();

  const [orderInformations, setOrderInformations] = useState([]);
  const [orderInformationsNotExist, setOrderInformationsNotExist] = useState(
    []
  );
  const [totalProductNbr, setTotalProductNbr] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [opacity, setOpacity] = useState(new Animated.Value(1));

  // get product informations
  useEffect(() => {
    if (selectedProduct) {
      getOrderInformations(
        selectedProduct.id_order,
        setOrderInformations,
        setOrderInformationsNotExist
      );
    }
  }, [selectedProduct]);

  // get product informations to receive real quantity
  useEffect(() => {
    if (!modalVisible) {
      getOrderInformations(
        selectedProduct.id_order,
        setOrderInformations,
        setOrderInformationsNotExist
      );
    }
  }, [modalVisible]);

  // get total product number
  useEffect(() => {
    if (orderInformations.length > 0) {
      orderInformations.forEach((item) => {
        item.status = 0;
      });
      setTotalProductNbr(() => {
        let total = 0;
        orderInformations.forEach((item) => {
          total += parseInt(item.quantity_expected);
        });
        return total;
      });
    } else if (orderInformationsNotExist) {
      setTotalProductNbr(() => {
        let total = 0;
        orderInformationsNotExist.forEach((item) => {
          total += parseInt(item.quantity);
        });
        return total;
      });
    }
  }, [orderInformations, orderInformationsNotExist]);

  // reset elements
  const resetOrderContent = () => {
    setOrderInformations([]);
    setSelectedProduct(null);
    setEan("");
  };

  // if ean is not null, scroll to the item with the ean
  useEffect(() => {
    if (ean && orderInformations.length > 0) {
      const foundIndex = orderInformations.findIndex(
        (item) => item.Ean13 === ean
      );
      if (foundIndex !== -1) {
        flatListRef.current.scrollToIndex({index: foundIndex});
      }
    }
  }, [ean, orderInformations]);

  // animate item
  useEffect(() => {
    if (ean) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        {iterations: 3}
      ).start();
    }
  }, [ean]);

  // validate reassort and update stock
  const handlePress = (data) => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir valider le réassort ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            data.forEach((item) => {
              const stockValue =
                parseInt(item.qty_received ? item.qty_received : 0) +
                parseInt(item.Quantity);
              const id_product = item.ProductId;
              const id_productAttribute = item.DeclinaisonId;
              updateStock(stockValue, id_product, id_productAttribute);
              updateReassortStatus(selectedProduct.id_order);
            });
          },
        },
      ]
    );
  };

  // flatlist render
  const renderFlatList = (data, renderItem) => (
    <FlatList
      ref={flatListRef}
      data={data}
      keyExtractor={(_, index) => index.toString()}
      showsVerticalScrollIndicator={false}
      onScrollToIndexFailed={(info) => {
        const wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(() => {
          flatListRef.current.scrollToIndex({
            index: info.index,
            animated: false,
          });
        });
      }}
      renderItem={renderItem}
      ListFooterComponent={() => {
        const allValidated = data.every((item) => item.status === 1);
        if (allValidated) {
          return (
            <Button
              color={"#ff9e1f"}
              title="Valider le réassort"
              onPress={() => handlePress(data)}
            />
          );
        }
        return null;
      }}
    />
  );

  // if product exist render this
  const ItemOrderInformation = React.memo(
    ({item, ean, opacity, setSelectedItem, setModalVisible}) => (
      <Animated.View style={[{opacity: item.Ean13 === ean ? opacity : 1}]}>
        <Pressable
          style={[
            styles.productContainer,
            item.Ean13 === ean &&
              item.Ean13 != "" &&
              styles.productContainerSelected,
            {backgroundColor: item.status === 1 ? "green" : "#ff9e1f"},
          ]}
          onPress={() => {
            setSelectedItem(item);
            setModalVisible(true);
          }}
        >
          <Image source={{uri: item.ImageUrl}} style={styles.productImage} />
          <View style={styles.productInformationsContainer}>
            <Text style={[styles.productInformations]}>
              {item.ProductName} {item.DeclinaisonName}
            </Text>
            <Text
              style={[
                styles.productInformations,
                {color: "yellow", marginTop: 0},
              ]}
            >
              Qté: {item.quantity_expected}
            </Text>
            <Text
              style={[
                styles.productInformations,
                {color: "#436B92", marginTop: 0},
              ]}
            >
              Prix d'achat: {item.price}€
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    )
  );

  const renderItemOrderInformation = ({item}) => (
    <ItemOrderInformation
      item={item}
      ean={ean}
      opacity={opacity}
      setSelectedItem={setSelectedItem}
      setModalVisible={setModalVisible}
    />
  );

  // if product NOT exist render this
  const ItemOrderInformationNotExist = React.memo(({item}) => (
    <View
      style={[
        styles.productInformationsContainer,
        {borderBottomWidth: 1, borderBottomColor: "#fff"},
      ]}
    >
      <Text style={[styles.productInformations]}>
        {item.id_product} {item.id_product_attribute}
      </Text>
      <Text
        style={[styles.productInformations, {color: "yellow", marginTop: 5}]}
      >
        Qté: {item.quantity}
      </Text>
      <Text
        style={[styles.productInformations, {color: "orange", marginTop: 5}]}
      >
        Prix d'achat: {item.price} €
      </Text>
    </View>
  ));

  const renderItemOrderInformationNotExist = ({item}) => (
    <ItemOrderInformationNotExist item={item} />
  );

  const MemoizedModalProductRestocking = React.memo(ModalProductRestocking);

  return (
    <View style={styles.restockingMenuContainer}>
      <Text style={styles.titleOrder}>{selectedProduct.title}</Text>
      <Text style={styles.nbrOrder}>{totalProductNbr} produits totaux</Text>
      <View style={styles.flatlistContainer}>
        {orderInformations.length > 0
          ? renderFlatList(orderInformations, renderItemOrderInformation)
          : renderFlatList(
              orderInformationsNotExist,
              renderItemOrderInformationNotExist
            )}
        <MemoizedModalProductRestocking
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedItem={selectedItem}
          setTotalProductNbr={setTotalProductNbr}
          selectedProduct={selectedProduct}
        />
      </View>
      <Pressable
        onPress={() => resetOrderContent()}
        style={styles.goBackButton}
      >
        <Text style={styles.goBackText}>Retour</Text>
      </Pressable>
    </View>
  );
};
