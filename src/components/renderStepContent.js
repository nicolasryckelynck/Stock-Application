import {Text, TouchableOpacity, View} from "react-native";

import {InventoryResult} from "./inventoryResult";
import {ComparisonResult} from "./comparisonResult";

export const renderStepContent = (data) => {
  // props from src/scanBarCodes.js
  const {
    scanningStep,
    scannedData1,
    styles,
    optionSelected,
    handleStepChange,
    productData1,
    setEnableModal,
    enableModal,
    resetScan,
    productData2,
    matching,
  } = data;

  if (scanningStep === 1 && scannedData1.length > 5) {
    return (
      // FIRST BAR CODE SCANNED -> WAITING FOR SECOND BAR CODE
      <View style={styles.dataContainer}>
        {optionSelected === 1 && optionSelected !== 2 ? (
          <TouchableOpacity
            style={styles.btnScanSecond}
            onPress={() => handleStepChange(2)}
          >
            <Text style={styles.btnScanText}>
              Scanner le deuxieme code barre
            </Text>
          </TouchableOpacity>
        ) : (
          optionSelected !== 3 && (
            // INVENTORY
            <InventoryResult
              styles={styles}
              productData1={productData1}
              setEnableModal={setEnableModal}
              enableModal={enableModal}
              resetScan={resetScan}
            />
          )
        )}
      </View>
    );
  } else if (scanningStep === 3) {
    return (
      // LAST STEP OF COMPARISON
      <ComparisonResult
        styles={styles}
        matching={matching}
        productData1={productData1}
        productData2={productData2}
        setEnableModal={setEnableModal}
        enableModal={enableModal}
        resetScan={resetScan}
      />
    );
  }
};
