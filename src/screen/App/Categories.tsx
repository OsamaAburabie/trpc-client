import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import React from "react";
import { RouterOutputs, trpc } from "../../utils/trpc";
import { NavigationProp, useNavigation } from "@react-navigation/native";
// import { FlashList } from "@shopify/flash-list";
import { AppStackParamList } from "../../navigation/AppStackNavigation";
const { width, height } = Dimensions.get("window");
const INDENT_SIZE = 20;

type Props = {
  navigation: NavigationProp<AppStackParamList, "Categories">;
};

const CategoryTree = ({
  categories,
  depth = 0,
}: {
  categories: RouterOutputs["category"]["getAllCategoriesWithSubCategories"];
  depth?: number;
}) => {
  const { navigate } =
    useNavigation<NavigationProp<AppStackParamList, "Categories">>();
  const [openCategories, setOpenCategories] = React.useState<string[]>([]);
  const toggleOpenCategory = (id: string) => {
    return () => {
      if (openCategories.includes(id)) {
        setOpenCategories(openCategories.filter((c) => c !== id));
      } else {
        setOpenCategories([...openCategories, id]);
      }
    };
  };

  const navigateToCategory = (
    id: RouterOutputs["category"]["findCategories"][0]["id"]
  ) => {
    return () => {
      navigate("Category", {
        id,
      });
    };
  };

  return (
    <View
      style={{
        gap: 10,
      }}
    >
      {categories.map((category) => {
        return (
          <View
            style={{
              gap: 10,
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
            key={category.id}
          >
            <TouchableOpacity
              onPress={
                category.subCategories
                  ? toggleOpenCategory(String(category.id))
                  : navigateToCategory(category.id)
              }
              style={{
                height: 100,
                backgroundColor: "#444",
                width: width - INDENT_SIZE * (depth + 1),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "500", fontSize: 26 }}>
                {category.name}
                {category.id}
              </Text>
            </TouchableOpacity>
            {openCategories.includes(String(category.id)) &&
              category.subCategories && (
                <CategoryTree
                  categories={category.subCategories}
                  depth={depth + 1}
                />
              )}
          </View>
        );
      })}
    </View>
  );
};

const Categories = ({ navigation }: Props) => {
  const utils = trpc.useContext();
  //   const { data } = trpc.category.findCategories.useQuery();
  const { data: categories } =
    trpc.category.getAllCategoriesWithSubCategories.useQuery();
  const { mutate } = trpc.category.deleteCategory.useMutation({
    onSuccess: () => {
      utils.category.findCategories.invalidate();
    },
  });

  const renderItem = ({
    item,
  }: {
    item: RouterOutputs["category"]["findCategories"][0];
  }) => (
    <TouchableOpacity
      onPress={() => {
        mutate({
          id: item.id,
        });
      }}
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
        {item.id}
      </Text>
      <Text
        style={{
          color: "#fff",
        }}
      >
        {item.parentId}
      </Text>
      <Text
        style={{
          color: "#fff",
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={{
        backgroundColor: "#333",
        flex: 1,
        paddingHorizontal: 10,
      }}
    >
      {/* <FlashList
       data={data}
       estimatedItemSize={200}
       renderItem={({ item }) => renderItem({ item })}
       keyExtractor={(item) => item.id.toString()}
     /> */}
      {categories ? <CategoryTree categories={categories} /> : null}
    </ScrollView>
  );
};

export default Categories;
