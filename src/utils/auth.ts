import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useOktoClient } from "./okto";

export const useHandleLogout = () => {
  const { clearSession } = useOktoClient();

  return async () => {
    Cookies.remove("next-auth.session-token");
    Cookies.remove("accessToken");
    Cookies.remove();
    localStorage.clear();
    clearSession();
    await signOut();
  };
};
