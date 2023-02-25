import { ReactQueryOptions, trpc } from "../utils/trpc";

export const useReaction = (
  likeMutationOptions?: ReactQueryOptions["post"]["likePost"],
  unlikeMutationOptions?: ReactQueryOptions["post"]["unlikePost"]
) => {
  const utils = trpc.useContext();
  const like = trpc.post.likePost.useMutation({
    ...likeMutationOptions,
    onMutate: (data) => {
      const oldPosts = utils.post.findMyPosts.getInfiniteData({
        limit: 10,
        cursor: undefined,
      });
      if (!oldPosts) return;
      utils.post.findMyPosts.setInfiniteData(
        {
          limit: 10,
          cursor: undefined,
        },
        {
          pages: oldPosts.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((post) => {
                if (post.id === data.postId) {
                  return {
                    ...post,
                    liked: true,
                  };
                }

                return post;
              }),
            };
          }),
          pageParams: oldPosts.pageParams,
        }
      );

      return { oldPosts };
    },
    onError: (_err, _data, context) => {
      if (!context?.oldPosts) return;
      utils.post.findMyPosts.setInfiniteData(
        {
          limit: 10,
          cursor: undefined,
        },
        {
          pages: context.oldPosts.pages,
          pageParams: context.oldPosts.pageParams,
        }
      );
    },
  });

  const unlike = trpc.post.unlikePost.useMutation({
    ...unlikeMutationOptions,
    onMutate: (data) => {
      const oldPosts = utils.post.findMyPosts.getInfiniteData({
        limit: 10,
        cursor: undefined,
      });
      if (!oldPosts) return;
      utils.post.findMyPosts.setInfiniteData(
        {
          limit: 10,
          cursor: undefined,
        },
        {
          pages: oldPosts.pages.map((page) => {
            return {
              ...page,
              posts: page.posts.map((post) => {
                if (post.id === data.postId) {
                  return {
                    ...post,
                    liked: false,
                  };
                }

                return post;
              }),
            };
          }),
          pageParams: oldPosts.pageParams,
        }
      );

      return { oldPosts };
    },
    onError: (_err, _data, context) => {
      if (!context?.oldPosts) return;
      utils.post.findMyPosts.setInfiniteData(
        {
          limit: 10,
          cursor: undefined,
        },
        {
          pages: context.oldPosts.pages,
          pageParams: context.oldPosts.pageParams,
        }
      );
    },
  });

  return { like, unlike };
};
