import { ReactQueryOptions, trpc } from "../utils/trpc";

export const useProductReaction = (
  categoryId: number,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  likeMutationOptions?: ReactQueryOptions["category"]["likeProduct"],
  unlikeMutationOptions?: ReactQueryOptions["category"]["unlikeProduct"]
) => {
  const utils = trpc.useContext();
  const like = trpc.category.likeProduct.useMutation({
    ...likeMutationOptions,
    onMutate: (data) => {
      setLiked(true);
      const oldProducts = utils.category.getProductsByCategory.getInfiniteData({
        categoryId,
        limit: 10,
        cursor: undefined,
      });
      if (!oldProducts) return;
      utils.category.getProductsByCategory.setInfiniteData(
        {
          categoryId,
          limit: 10,
          cursor: undefined,
        },
        {
          pages: oldProducts.pages.map((page) => {
            return {
              ...page,
              products: page.products.map((product) => {
                if (product.id === data.productId) {
                  return {
                    ...product,
                    liked: true,
                  };
                }

                return product;
              }),
            };
          }),
          pageParams: oldProducts.pageParams,
        }
      );

      return { oldProducts };
    },
    onError: (_err, _data, context) => {
      setLiked(false);
      if (!context?.oldProducts) return;
      utils.category.getProductsByCategory.setInfiniteData(
        {
          categoryId,
          limit: 10,
          cursor: undefined,
        },
        {
          pages: context.oldProducts.pages,
          pageParams: context.oldProducts.pageParams,
        }
      );
    },
  });

  const unlike = trpc.category.unlikeProduct.useMutation({
    ...unlikeMutationOptions,
    onMutate: (data) => {
      setLiked(false);
      const oldProducts = utils.category.getProductsByCategory.getInfiniteData({
        categoryId,
        limit: 10,
        cursor: undefined,
      });
      if (!oldProducts) return;
      utils.category.getProductsByCategory.setInfiniteData(
        {
          categoryId,
          limit: 10,
          cursor: undefined,
        },
        {
          pages: oldProducts.pages.map((page) => {
            return {
              ...page,
              products: page.products.map((product) => {
                if (product.id === data.productId) {
                  return {
                    ...product,
                    liked: false,
                  };
                }

                return product;
              }),
            };
          }),
          pageParams: oldProducts.pageParams,
        }
      );

      return { oldProducts };
    },
    onError: (_err, _data, context) => {
      setLiked(true);
      if (!context?.oldProducts) return;
      utils.category.getProductsByCategory.setInfiniteData(
        {
          categoryId,
          limit: 10,
          cursor: undefined,
        },
        {
          pages: context.oldProducts.pages,
          pageParams: context.oldProducts.pageParams,
        }
      );
    },
  });

  return { like, unlike };
};
