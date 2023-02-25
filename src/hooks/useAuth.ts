import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../store";
import { setUserData } from "../store/AuthReducer";
import { RouterOutputs } from "../utils/trpc";

export const useAuth = () => {
  const dispatch = useDispatch();
  const userData = useAppSelector((state) => state?.auth?.userData);

  const setUser = (userData: any) => {
    dispatch(setUserData(userData));
  };

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return { userData, setUser, logout };
};
