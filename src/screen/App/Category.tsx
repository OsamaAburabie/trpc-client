import { View, Text, Button, TextInput } from "react-native";
import React from "react";
import { trpc, RouterInputs } from "../../utils/trpc";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { AppStackParamList } from "../../navigation/AppStackNavigation";
import { useForm, Controller } from "react-hook-form";

type Props = {
  navigation: NavigationProp<AppStackParamList, "Category">;
  route: RouteProp<AppStackParamList, "Category">;
};

type FormData = RouterInputs["category"]["createProduct"];

const Category = ({ navigation, route }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormData>({});

  const utils = trpc.useContext();
  const { mutate } = trpc.category.createProduct.useMutation();
  const { data } = trpc.category.getProductsByCategory.useQuery({
    categoryId: route.params.id,
  });

  const onSubmit = handleSubmit((data) => {
    mutate({
      ...data,
      categoryId: route.params.id,
      price: Number(data.price),
    });
  });

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
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              height: 40,
              width: "100%",
              borderColor: "gray",
              borderWidth: 1,
            }}
            placeholder="name"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <View style={{ height: 10 }} />

      <Controller
        control={control}
        name="price"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              height: 40,
              width: "100%",
              borderColor: "gray",
              borderWidth: 1,
            }}
            placeholder="price"
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <View style={{ height: 10 }} />

      <Button title="Submit" onPress={onSubmit} />
      <Button
        title="Go to products"
        onPress={() => {
          navigation.navigate("Products", {
            id: route.params.id,
          });
        }}
      />
    </View>
  );
};

export default Category;
