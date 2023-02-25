import { View, Text, ActivityIndicator, Pressable } from "react-native";
import React from "react";
import { RouterOutputs, trpc } from "../../utils/trpc";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParamList } from "../../navigation/AppStackNavigation";
import { FlatList } from "react-native";
import { useReaction } from "../../hooks/useReaction";

type Props = {
  navigation: NavigationProp<AppStackParamList, "Posts">;
};

const PostItem = ({
  post,
}: {
  post: RouterOutputs["post"]["findMyPosts"]["posts"][0];
}) => {
  const { like, unlike } = useReaction();

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
        {post.title}
      </Text>
      <Text
        style={{
          color: "#fff",
        }}
      >
        {post.content}
      </Text>

      <Pressable
        onPress={() => {
          if (post.liked) {
            unlike.mutate({
              postId: post.id,
            });
          } else {
            like.mutate({
              postId: post.id,
            });
          }
        }}
        style={{
          backgroundColor: post?.liked ? "#fff" : "teal",
          padding: 10,
        }}
      >
        <Text
          style={{
            color: post?.liked ? "teal" : "#fff",
          }}
        >
          Like
        </Text>
      </Pressable>
    </View>
  );
};

const Posts = ({ navigation }: Props) => {
  const { data, hasNextPage, isFetching, fetchNextPage, isLoading, refetch } =
    trpc.post.findMyPosts.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnMount: false,
      }
    );

  const [refreshing, setRefreshing] = React.useState(false);

  const renderItem = ({
    item,
  }: {
    item: RouterOutputs["post"]["findMyPosts"]["posts"][0];
  }) => <PostItem post={item} />;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#444",
      }}
    >
      <FlatList
        data={data?.pages.map((page) => page.posts).flat()}
        refreshing={refreshing}
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

export default Posts;
