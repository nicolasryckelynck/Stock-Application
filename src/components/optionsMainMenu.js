import {Text, TouchableOpacity, View} from "react-native";
import {useDispatch} from "react-redux";
import {styles} from "../styles/style";
import {removeToken} from "../token/removeToken";

export const OptionsMainMenu = ({setoptionSelected, setEmployesSelected}) => {
  const dispatch = useDispatch();
  return (
    <View>
      <Text style={styles.chooseOptionText}>
        Choisissez l'option à exécuter
      </Text>
      <View style={styles.containerOptions}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setoptionSelected(1)}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Comparaison</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setoptionSelected(2)}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Inventaire</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setoptionSelected(3)}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Mise à jour EAN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setoptionSelected(4)}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>Réassort</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          removeToken(dispatch);
          setoptionSelected(0);
          setEmployesSelected("");
        }}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
};
