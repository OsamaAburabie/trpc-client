import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import { RouterOutputs, trpc } from "../../utils/trpc";
import { NavigationProp } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { AppStackParamList } from "../../navigation/AppStackNavigation";

type Props = {
  navigation: NavigationProp<AppStackParamList, "Users">;
};

const Users = ({ navigation }: Props) => {
  const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
    trpc.user.getAllUsers.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnMount: true,
      }
    );

  const renderItem = ({
    item,
  }: {
    item: RouterOutputs["user"]["getAllUsers"]["users"][0];
  }) => (
    <TouchableOpacity
      style={{
        height: 200,
        width: "100%",
        backgroundColor: "#444",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
      }}
      onPress={() => {
        navigation.navigate("UserData", { user: item });
      }}
    >
      <Text
        style={{
          color: "#fff",
        }}
      >
        {item.email}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlashList
      data={data?.pages.map((page) => page.users).flat()}
      estimatedItemSize={200}
      renderItem={({ item }) => renderItem({ item })}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={() => {
        if (hasNextPage && !isFetching) {
          fetchNextPage();
        }
      }}
      ListFooterComponent={
        isFetching && !isLoading ? (
          <View>
            <ActivityIndicator
              style={{
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#444",
              }}
              size="small"
            />
          </View>
        ) : null
      }
    />
  );
};

export default Users;
