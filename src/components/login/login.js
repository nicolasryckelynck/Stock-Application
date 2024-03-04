import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {Formik} from "formik";
import {useDispatch} from "react-redux";
import * as Yup from "yup";

import {styles} from "../../styles/style";

import {loginApi} from "../../api/loginApi";

export const Login = ({employesData, setEmployesSelected}) => {
  const dispatch = useDispatch();

  // validation schema for password
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Veuillez renseigner un mot de passe")
      .matches(
        /^[^'"#=+\-_*~]*$/,
        "Les caractères spéciaux ne sont pas autorisés"
      ),
  });

  // handle login validation
  const handleLoginValidation = (values) => {
    loginApi(values, dispatch);
  };

  return (
    <Formik
      initialValues={{email: employesData.email, password: ""}}
      validationSchema={validationSchema}
      onSubmit={(values) => handleLoginValidation(values)}
    >
      {({handleChange, handleBlur, handleSubmit, values, errors, touched}) => (
        <View style={styles.loginForm}>
          <Text style={styles.loginTitle}>Connexion</Text>
          <TextInput
            style={styles.loginInput}
            onChangeText={handleChange("email")}
            onBlur={handleBlur("email")}
            value={values.email}
            editable={false}
          />
          <TextInput
            style={styles.loginInput}
            placeholder="Mot de passe"
            onChangeText={handleChange("password")}
            onBlur={handleBlur("password")}
            value={values.password}
            secureTextEntry={true}
          />
          {errors.password && touched.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEmployesSelected("")}
            style={[styles.goBackButton, {height: 35, marginTop: 0}]}
          >
            <Text style={styles.goBackText}>Retour</Text>
          </TouchableOpacity>
        </View>
      )}
    </Formik>
  );
};
