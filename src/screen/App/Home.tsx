import { View, Text, Button, TextInput } from "react-native";
import React from "react";
import { trpc } from "../../utils/trpc";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../navigation/AppStackNavigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
type Props = {
  navigation: NavigationProp<AppStackParamList, "Home">;
};

const validationSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  content: z.string({ required_error: "Content is required" }),
});

type FormData = z.infer<typeof validationSchema>;

const Home = ({ navigation }: Props) => {
  const { logout } = useAuth();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const { mutate } = trpc.post.createPost.useMutation();

  const onSubmit = handleSubmit((data) => {
    mutate(data);
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
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              height: 40,
              width: "100%",
              borderColor: "gray",
              borderWidth: 1,
            }}
            placeholder="Title"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />
      <View style={{ height: 10 }} />

      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              height: 40,
              width: "100%",
              borderColor: "gray",
              borderWidth: 1,
            }}
            placeholder="Content"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      <View style={{ height: 10 }} />

      <Button title="Submit" onPress={onSubmit} />
      <Button
        title="Go to Users"
        onPress={() => {
          navigation.navigate("Users");
        }}
      />
      <Button
        title="Go to Posts"
        onPress={() => {
          navigation.navigate("Posts");
        }}
      />
      <Button
        title="Go to Category"
        onPress={() => {
          navigation.navigate("CreateCategory");
        }}
      />
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default Home;
