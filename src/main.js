import React, {useEffect, useState} from "react";
import {Text, View} from "react-native";
import {Audio} from "expo-av";
import {BarCodeScanner} from "expo-barcode-scanner";
import {useSelector} from "react-redux";

// styles
import {styles} from "./styles/style";

// components
import {renderCamera} from "./components/renderCamera";
import {renderStepContent} from "./components/renderStepContent";
import {MainMenu} from "./components/mainMenu";
import {EmployeList} from "./components/employeList";

// api
import {getEmployes, verifyEmploye} from "./api/getEmployes";
import {getProductsMatching} from "./api/getProductsInfo";
import {addRecord} from "./api/addRecord";

//sound
import {playSuccessSound, playErrorSound} from "./components/sound";

export default function StockApplication() {
  const [optionSelected, setoptionSelected] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData1, setScannedData1] = useState("");
  const [scannedData2, setScannedData2] = useState("");
  const [matching, setMatching] = useState(false);
  const [scanningStep, setScanningStep] = useState(1);
  const [cameraVisible, setCameraVisible] = useState(true);
  const [successSound, setSuccessSound] = useState();
  const [errorSound, setErrorSound] = useState();
  const [productData1, setProductData1] = useState([]);
  const [productData2, setProductData2] = useState([]);
  const [enableModal, setEnableModal] = useState(false);
  const [textEan, setTextEan] = useState("");
  const [upcUpdated, setUpcUpdated] = useState("");
  const [employes, setEmployes] = useState([]);
  const [employesData, setEmployesData] = useState([]);
  const [employeSelected, setemployeSelected] = useState("");

  // receive token from redux
  const token = useSelector((state) => state.token);

  // request camera permission
  useEffect(() => {
    (async () => {
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // load sounds
  useEffect(() => {
    const loadSounds = async () => {
      const [success, error] = await Promise.all([
        Audio.Sound.createAsync(require("../assets/song/ding.mp3")),
        Audio.Sound.createAsync(require("../assets/song/error.mp3")),
      ]);
      setSuccessSound(success.sound);
      setErrorSound(error.sound);
    };

    loadSounds();
  }, []);

  // receive employes from database at the beginning
  useEffect(() => {
    if (!token) getEmployes(setEmployes);
    else verifyEmploye(token[0], setemployeSelected);
  }, []);

  // handle employee selection
  const handleEmployeeSelection = (employee) => {
    setEmployesData(employee);
    setemployeSelected(employee.id_employee.toString());
  };

  // compare barcodes for comparison mode
  const compareBarcodes = async () => {
    if (scannedData1 === scannedData2) {
      setMatching(true);
      playSuccessSound(successSound);
      await getProductsMatching({
        data1: scannedData1,
        data2: scannedData2,
        setProductData1,
        setProductData2,
      });
    } else {
      setMatching(false);
      playErrorSound(errorSound);
      await getProductsMatching({
        data1: scannedData1,
        data2: scannedData2,
        setProductData1,
        setProductData2,
      });
    }
  };

  // add record to database
  useEffect(() => {
    if (
      productData1["ProductId"] &&
      optionSelected > 0 &&
      optionSelected !== 3
    ) {
      addRecord({
        productData1,
        productData2,
        textEan,
        optionSelected,
        employeSelected,
        upcUpdated,
        status: 0,
      });
    }
  }, [productData1, productData2]);

  // receive data from camera and set scannedData1 or scannedData2
  const handleBarCodeScanned = (data) => {
    if (scanningStep === 1) {
      setScannedData1(data);
      setCameraVisible(false);
    } else if (scanningStep === 2) {
      setScannedData2(data);
    }
  };

  // when scannedData1 and scannedData2 are set, compare barcodes and display result of comparison
  useEffect(() => {
    if (scannedData2 && scannedData2.length > 5) {
      setScanningStep(3);
      compareBarcodes();
    }
  }, [scannedData2]);

  // reset all states
  const resetScan = () => {
    setTextEan("");
    setScannedData1("");
    setScannedData2("");
    setMatching(false);
    setScanningStep(1);
    setCameraVisible(true);
    setProductData1([]);
    setProductData2([]);
    setoptionSelected(0);
    setUpcUpdated("");
  };

  // set step change
  const handleStepChange = (step) => {
    setTextEan("");
    setScanningStep(step);
    setCameraVisible(true);
  };

  // handle text input change
  let typingTimeout = 0;
  const handleTextInputChange = (text) => {
    setTextEan(text);
    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      handleBarCodeScanned(text);
    }, 2300);
  };

  // get product info when textEan is set
  const getProductInfo = async () => {
    await getProductsMatching({
      data1: scannedData1,
      data2: "",
      setProductData1,
      setProductData2,
    });
  };

  // get product info when scannedData1 is set
  useEffect(() => {
    if (scanningStep === 1 && optionSelected === 2) getProductInfo();
  }, [scannedData1]);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Demande de permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>La permission de la caméra a été refusée</Text>
      </View>
    );
  }

  // props to send to components
  const sharedProps = {
    scanningStep,
    styles,
    optionSelected,
    resetScan,
  };

  const renderProps = {
    camera: {
      ...sharedProps,
      cameraVisible,
      textEan,
      handleTextInputChange,
      handleBarCodeScanned,
      setUpcUpdated,
      upcUpdated,
      productData1,
      setProductData1,
      employeSelected,
    },
    stepContent: {
      ...sharedProps,
      scannedData1,
      handleStepChange,
      productData1,
      setEnableModal,
      enableModal,
      productData2,
      matching,
    },
  };

  const renderComponent = (optionSelected, employeSelected) => {
    const components = {
      1: renderCamera(renderProps.camera),
      2: (
        <MainMenu
          setoptionSelected={setoptionSelected}
          employesData={employesData}
          setEmployesSelected={setemployeSelected}
        />
      ),
      3: (
        <EmployeList
          employes={employes}
          handleEmployeeSelection={handleEmployeeSelection}
        />
      ),
    };

    if (optionSelected !== 0 && employeSelected) {
      return components["1"];
    } else if (employeSelected) {
      return components["2"];
    } else if (!token) {
      return components["3"];
    }
  };

  return (
    <View style={styles.container}>
      {renderComponent(optionSelected, employeSelected)}
      {renderStepContent(renderProps.stepContent)}
    </View>
  );
}
