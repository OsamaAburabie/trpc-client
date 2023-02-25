import { createSlice } from "@reduxjs/toolkit";
import { RouterOutputs } from "../utils/trpc";

type InitialState = {
  userData: RouterOutputs["auth"]["login"]["data"] | null;
};

const initialState: InitialState = {
  userData: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = authSlice.actions;
export default authSlice.reducer;
