import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../../screen/Auth/Login";
import SignUp from "../../screen/Auth/SignUp";

export type AuthStackParamList = {
  login: undefined;
  signUp: undefined;
};

const AuthStack = () => {
  const { Navigator, Screen } = createStackNavigator<AuthStackParamList>();
  return (
    <Navigator initialRouteName="login">
      <Screen name="login" component={Login} />
      <Screen name="signUp" component={SignUp} />
    </Navigator>
  );
};
export default AuthStack;
