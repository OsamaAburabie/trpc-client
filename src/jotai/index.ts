import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouterOutputs } from "../utils/trpc";

const storage = createJSONStorage(() => AsyncStorage);
const content = null; // anything JSON serializable
export const userAtom = atomWithStorage<
  RouterOutputs["auth"]["register"]["data"] | null
>("stored-key", content, storage as never);
