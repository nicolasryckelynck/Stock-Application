import {FlatList, Text, TouchableOpacity, View} from "react-native";

import {styles} from "../styles/style";

export const EmployeList = ({employes, handleEmployeeSelection}) => {
  return (
    <View style={styles.employeeListContainer}>
      <FlatList
        data={employes}
        keyExtractor={(item) => item.id_employee.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => handleEmployeeSelection(item)}
            style={styles.employee}
          >
            <Text
              style={styles.employeeName}
            >{`${item.firstname} ${item.lastname}`}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
