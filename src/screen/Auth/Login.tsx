import { View, Text, Button, TextInput } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "../../utils/trpc";
import { useAuth } from "../../hooks/useAuth";
import { AppStackParamList } from "../../navigation/AppStackNavigation";
type Props = {
  navigation: NavigationProp<AppStackParamList, "Login">;
};

const validationSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

type FormData = z.infer<typeof validationSchema>;

const Login = ({ navigation }: Props) => {
  const { setUser } = useAuth();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(validationSchema),
  });

  const { mutateAsync } = trpc.auth.login.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await mutateAsync(data);

      if (res.data) {
        setUser(res.data);
      }
    } catch (error) {}
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
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              height: 40,
              width: "100%",
              borderColor: "gray",
              borderWidth: 1,
            }}
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors.email ? (
        <Text
          style={{
            color: "red",
          }}
        >
          {errors.email?.message}
        </Text>
      ) : null}

      <View style={{ height: 10 }} />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{
              height: 40,
              width: "100%",
              borderColor: "gray",
              borderWidth: 1,
            }}
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
        )}
      />

      {errors.password ? (
        <Text
          style={{
            color: "red",
          }}
        >
          {errors.password?.message}
        </Text>
      ) : null}

      <Button title="Submit" onPress={onSubmit} />
      <Button
        title="Go to SignUp"
        onPress={() => {
          navigation.navigate("SignUp");
        }}
      />
    </View>
  );
};

export default Login;
