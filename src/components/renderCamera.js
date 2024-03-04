/*import {BarCodeScanner} from "expo-barcode-scanner";*/

import {UpdateEanMenu} from "./updateEanMenu";
import {FirstScanComponent} from "./firstScanComponent";
import {RestockingMenu} from "./restockingMenu";

export const renderCamera = (data) => {
  // props from src/scanBarCodes.js
  const {
    scanningStep,
    cameraVisible,
    styles,
    optionSelected,
    textEan,
    handleTextInputChange,
    resetScan,
    handleBarCodeScanned,
    setUpcUpdated,
    upcUpdated,
    productData1,
    setProductData1,
    employeSelected,
  } = data;

  const updateUpc = (newUpc) => {
    setUpcUpdated(newUpc);
  };

  if (
    cameraVisible &&
    (scanningStep === 1 || scanningStep === 2) &&
    optionSelected !== 3 &&
    optionSelected !== 4
  ) {
    return (
      <FirstScanComponent
        optionSelected={optionSelected}
        styles={styles}
        handleTextInputChange={handleTextInputChange}
        resetScan={resetScan}
      />
      //   <BarCodeScanner
      //     onBarCodeScanned={handleBarCodeScanned}
      //     style={StyleSheet.absoluteFillObject}
      //   />
    );
  } else if (optionSelected === 3) {
    return (
      <UpdateEanMenu
        styles={styles}
        upcUpdated={upcUpdated}
        textEan={textEan}
        handleTextInputChange={handleTextInputChange}
        resetScan={resetScan}
        updateUpc={updateUpc}
        productData1={productData1}
        setProductData1={setProductData1}
        employeSelected={employeSelected}
        optionSelected={optionSelected}
        setUpcUpdated={setUpcUpdated}
      />
    );
  } else if (optionSelected === 4) {
    return (
      <RestockingMenu resetScan={resetScan} employeSelected={employeSelected} />
    );
  }
};
