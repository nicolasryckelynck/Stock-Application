import React, {useEffect} from "react";
import {View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Login} from "./login/login";

import {checkTokenValidity} from "../token/checkTokenValidity";
import {OptionsMainMenu} from "./optionsMainMenu";

export const MainMenu = ({
  setoptionSelected,
  employesData,
  setEmployesSelected,
}) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);

  // check token validity on component mount
  useEffect(() => {
    checkTokenValidity(token, dispatch);
  }, [token, dispatch]);

  return (
    <View>
      {token ? (
        <OptionsMainMenu
          setoptionSelected={setoptionSelected}
          setEmployesSelected={setEmployesSelected}
        />
      ) : (
        <Login
          employesData={employesData}
          setEmployesSelected={setEmployesSelected}
        />
      )}
    </View>
  );
};
