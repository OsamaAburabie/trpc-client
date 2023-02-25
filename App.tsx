import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { trpc } from "./src/utils/trpc";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryKey,
} from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import RootStack from "./src/navigation/RootStackNavigation";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getQueryKey } from "@trpc/react-query";
import { Provider } from "react-redux";
import store, { persistedStore } from "./src/store";
import { PersistGate } from "redux-persist/integration/react";
import Toast from "react-native-toast-message";

const PROD_URL = "https://trpc-backend.onrender.com/trpc";
const DEV_URL = "http://192.168.1.95:3000/trpc";
function App() {
  const cacheTime = 1000 * 60 * 60 * 24; // 24 hours

  const mutationCache = new MutationCache({
    onError: (error: any, _variables, _context, mutation) => {
      // If this mutation has an onError defined, skip this
      if (mutation.options.onError) return;

      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message ? error.message : "Something went wrong",
      });
    },
  });

  const queryCache = new QueryCache({
    onError: (err: any) => {
      // any error handling code...
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err?.message ? err.message : "Something went wrong",
      });
    },
  });
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime,
          },
        },
        mutationCache,
        queryCache,
      })
  );

  const trpcClient = trpc.createClient({
    links: [
      httpLink({
        url: DEV_URL,
        headers() {
          return {
            Authorization: `Bearer ${
              store.getState().auth.userData?.accessToken?.access_token
            }`,
          };
        },
      }),
    ],
  });

  const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
  });

  const doNotPersistQueries: QueryKey[] = [
    getQueryKey(trpc.user.getAllUsers),
    getQueryKey(trpc.post.findMyPosts),
    getQueryKey(trpc.category.getProductsByCategory),
  ];

  const includesDeep = (array: QueryKey[], searchValue: QueryKey) => {
    return array.some((item) => {
      return JSON.stringify(item[0]) === JSON.stringify(searchValue[0]);
    });
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
              persister: asyncStoragePersister,
              hydrateOptions: {},
              dehydrateOptions: {
                shouldDehydrateQuery: ({ queryKey }) => {
                  return !includesDeep(doNotPersistQueries, queryKey);
                },
              },
            }}
          >
            <RootStack />
            <Toast />
          </PersistQueryClientProvider>
        </trpc.Provider>
      </PersistGate>
    </Provider>
  );
}

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
