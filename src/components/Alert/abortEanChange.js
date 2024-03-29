import {showAlert} from "./showAlert";
import {updateEan} from "../../api/updateEan";

export const abortEanChange = (productData, tmpEAN) => {
  showAlert(
    "Confirmation",
    "Êtes-vous sûr de vouloir annuler la mise à jours du code EAN ?",
    () => {
      updateEan({
        productData1: productData,
        textEan: tmpEAN,
      });
    }
  );
};
