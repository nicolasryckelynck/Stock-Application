import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#436B92",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 5,
    borderWidth: 1,
    borderColor: "#fff",
    width: "100%",
    height: "80%",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#ff9e1f",
    borderBottomWidth: 1,
    borderBottomColor: "#ff9e1f",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
    color: "#ff9e1f",
    fontWeight: "bold",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  calendarTextStyle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "500",
    padding: 3,
  },
  closeModalButton: {
    backgroundColor: "#ff9e1f",
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
    borderRadius: 7,
    height: "7%",
    margin: 10,
  },
});
