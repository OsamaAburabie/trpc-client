import { View, Text, Button, TextInput, ActivityIndicator } from "react-native";
import React from "react";
import { trpc } from "../../utils/trpc";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../navigation/AppStackNavigation";

type Props = {
  navigation: NavigationProp<AppStackParamList, "Users">;
  route: RouteProp<AppStackParamList, "UserData">;
};

const UserData = ({ route }: Props) => {
  const [form, setForm] = React.useState({
    email: route.params.user.email || "",
    password: route.params.user.password || "",
  });
  const utils = trpc.useContext();
  const { data, isLoading } = trpc.user.getUser.useQuery(
    {
      id: route.params.user.id,
    },
    {
      placeholderData: {
        ...route.params.user,
      },
    }
  );

  const { mutate, isLoading: updateLoading } = trpc.user.updateUser.useMutation(
    {
      onSuccess: () => {
        utils.user.getAllUsers.invalidate();
        utils.user.getUser.invalidate({ id: route.params.user.id });
      },
    }
  );

  const handleSubmit = () => {
    mutate({
      id: route.params.user.id,
      email: form.email,
      password: form.password,
    });
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
      }}
    >
      <Text>{data?.id}</Text>
      <Text>{data?.email}</Text>
      <Text>{data?.password}</Text>

      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "100%",
          marginVertical: 10,
        }}
        placeholder="email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: "100%",
        }}
        placeholder="password"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
      />

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        {!updateLoading ? (
          <Button title="Update" onPress={handleSubmit} />
        ) : (
          <ActivityIndicator size="small" color="#333" />
        )}
      </View>
    </View>
  );
};

export default UserData;
