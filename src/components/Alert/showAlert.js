import {Alert} from "react-native";

export const showAlert = (title, message, onConfirm, onCancel) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: "Annuler",
        style: "cancel",
        onPress: onCancel,
      },
      {
        text: "Valider",
        onPress: onConfirm,
      },
    ],
    {cancelable: true}
  );
};
