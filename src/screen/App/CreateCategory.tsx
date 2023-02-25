import { View, Text, Button, TextInput } from "react-native";
import React from "react";
import { trpc, RouterInputs } from "../../utils/trpc";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../navigation/AppStackNavigation";
import { useForm, Controller } from "react-hook-form";

type Props = {
  navigation: NavigationProp<AppStackParamList, "CreateCategory">;
};

type FormData = RouterInputs["category"]["createCategory"];

const CreateCategory = ({ navigation }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
    },
  });

  const { mutate } = trpc.category.createCategory.useMutation();

  const onSubmit = handleSubmit((data) => {
    mutate({
      name: data.name,
      ...(data.parentId && { parentId: Number(data.parentId) }),
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
        name="parentId"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              height: 40,
              width: "100%",
              borderColor: "gray",
              borderWidth: 1,
            }}
            placeholder="parentId"
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <View style={{ height: 10 }} />

      <Button title="Submit" onPress={onSubmit} />
      <Button
        title="Categories"
        onPress={() => {
          navigation.navigate("Categories");
        }}
      />
    </View>
  );
};

export default CreateCategory;
