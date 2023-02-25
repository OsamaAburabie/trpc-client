import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { RouterOutputs } from "../../utils/trpc";
import Home from "../../screen/App/Home";
import Users from "../../screen/App/Users";
import UserData from "../../screen/App/UserData";
import Login from "../../screen/Auth/Login";
import SignUp from "../../screen/Auth/SignUp";
import { useAuth } from "../../hooks/useAuth";
import Posts from "../../screen/App/Posts";
import CreateCategory from "../../screen/App/CreateCategory";
import Categories from "../../screen/App/Categories";
import Category from "../../screen/App/Category";
import Products from "../../screen/App/Products";

export type AppStackParamList = {
  Home: undefined;
  Users: undefined;
  UserData: {
    user: RouterOutputs["user"]["getAllUsers"]["users"][0];
  };
  CreateCategory: undefined;
  Category: {
    id: RouterOutputs["category"]["findCategories"][0]["id"];
  };
  Products: {
    id: RouterOutputs["category"]["findCategories"][0]["id"];
  };
  Categories: undefined;
  Posts: undefined;
  Login: undefined;
  SignUp: undefined;
};

const AppStack = () => {
  const { userData } = useAuth();
  const { Navigator, Screen } = createStackNavigator<AppStackParamList>();

  return (
    <Navigator initialRouteName="Home">
      {userData?.user ? (
        <React.Fragment>
          <Screen name="Home" component={Home} />
          <Screen name="Users" component={Users} />
          <Screen name="UserData" component={UserData} />
          <Screen name="Posts" component={Posts} />
          <Screen name="CreateCategory" component={CreateCategory} />
          <Screen name="Categories" component={Categories} />
          <Screen name="Category" component={Category} />
          <Screen name="Products" component={Products} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Screen name="Login" component={Login} />
          <Screen name="SignUp" component={SignUp} />
        </React.Fragment>
      )}
    </Navigator>
  );
};
export default AppStack;
