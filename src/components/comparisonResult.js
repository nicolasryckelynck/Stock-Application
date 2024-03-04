import {Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import {AntDesign, Entypo} from "@expo/vector-icons";

import ModalStock from "../modal/modal";

const {height, width} = Dimensions.get("window");

export const ComparisonResult = ({
  styles,
  matching,
  productData1,
  productData2,
  setEnableModal,
  enableModal,
  resetScan,
}) => {
  const ProductDetails = ({productData}) => (
    <View style={styles.productsMatch}>
      <Text style={styles.productMatchTitle}>
        {productData["ProductName"]} - {productData["DeclinaisonName"]}
      </Text>
      <Image
        source={{uri: productData["ImageUrl"]}}
        style={styles.productMatchImage}
      />
      <Text style={[styles.productMatchTitle, {color: "#436B92"}]}>
        UPC: {productData["Upc2"]}
      </Text>
      <Text style={[styles.productMatchTitle, {color: "red"}]}>
        Stock: {productData["Quantity"]}
      </Text>
      <Text style={[styles.productMatchTitle, {color: "green"}]}>
        DLUO: {productData["expiryDate"]}
      </Text>
    </View>
  );

  return (
    <View style={[styles.dataContainer, {backgroundColor: "#436B92"}]}>
      <Text style={[styles.matchTitle, {bottom: matching ? 0 : height * 0.1}]}>
        {matching ? "Matching !" : "Erreur !"}
      </Text>
      {productData1["ProductName"] && productData2["ProductName"] ? (
        <View style={styles.matchingContainer}>
          <ProductDetails productData={productData1} />
          <ProductDetails productData={productData2} />
        </View>
      ) : (
        matching && (
          <Text style={styles.noInformations}>
            Aucune information disponible
          </Text>
        )
      )}

      {matching ? (
        <>
          <TouchableOpacity
            onPress={() => {
              if (productData1["ProductName"] && productData2["ProductName"])
                setEnableModal(!enableModal);
            }}
          >
            <AntDesign name="checkcircle" size={290} color="#fff" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Entypo name="circle-with-cross" size={290} color="red" />
        </>
      )}

      <TouchableOpacity style={[styles.btnScanOther]} onPress={resetScan}>
        <Text style={styles.btnScanText}>Scanner un autre code</Text>
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
    </View>
  );
};
