import { View, Text, ActivityIndicator, Pressable } from "react-native";
import React, { useEffect } from "react";
import { RouterOutputs, trpc } from "../../utils/trpc";
import { NavigationProp, RouteProp, useRoute } from "@react-navigation/native";
import { AppStackParamList } from "../../navigation/AppStackNavigation";
import { useProductReaction } from "../../hooks/useProductReaction";
import { FlashList } from "@shopify/flash-list";

type Props = {
  navigation: NavigationProp<AppStackParamList, "Products">;
  route: RouteProp<AppStackParamList, "Products">;
};

const ProductItem = ({
  product,
  isFetching,
}: {
  product: RouterOutputs["category"]["getProductsByCategory"]["products"][0];
  isFetching: boolean;
}) => {
  const { params } = useRoute<RouteProp<AppStackParamList, "Products">>();
  const [liked, setLiked] = React.useState(product.liked);
  const productReaction = useProductReaction(params.id, setLiked);

  useEffect(() => {
    setLiked(product.liked);
  }, [product.liked]);

  return (
    <View
      style={{
        height: 200,
        width: "100%",
        backgroundColor: "#444",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
      }}
    >
      <Text
        style={{
          color: "#fff",
        }}
      >
        {product.name}
      </Text>
      <Text
        style={{
          color: "#fff",
        }}
      >
        {product.price}
      </Text>

      <Pressable
        onPress={() => {
          if (isFetching) return;
          if (liked) {
            productReaction.unlike.mutate({
              productId: product.id,
            });
          } else {
            productReaction.like.mutate({
              productId: product.id,
            });
          }
        }}
        style={{
          backgroundColor: liked ? "#fff" : "teal",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: liked ? "teal" : "#fff",
          }}
        >
          {liked ? "Unlike" : "Like"}
        </Text>
      </Pressable>
    </View>
  );
};

const Products = ({ navigation, route }: Props) => {
  const { data, hasNextPage, isFetching, fetchNextPage, isLoading, refetch } =
    trpc.category.getProductsByCategory.useInfiniteQuery(
      {
        categoryId: route.params.id,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        // refetchOnMount: false,
        // keepPreviousData: false,
        // networkMode: "always",
      }
    );

  const [refreshing, setRefreshing] = React.useState(false);

  const renderItem = ({
    item,
  }: {
    item: RouterOutputs["category"]["getProductsByCategory"]["products"][0];
  }) => <ProductItem isFetching={isFetching} product={item} />;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#444",
      }}
    >
      <FlashList
        data={data?.pages.map((page) => page.products).flat()}
        refreshing={refreshing}
        estimatedItemSize={200}
        onRefresh={() => {
          setRefreshing(true);
          refetch().finally(() => {
            setRefreshing(false);
          });
        }}
        renderItem={renderItem}
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
    </View>
  );
};

export default Products;
