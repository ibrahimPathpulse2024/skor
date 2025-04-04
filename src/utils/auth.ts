import { useOkto } from "@okto_web3/react-sdk";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useOktoClient } from "./okto";

export const useHandleLogout = () => {
  const { clearSession } = useOktoClient();

  return async () => {
    Cookies.remove("next-auth.session-token");
    Cookies.remove("accessToken");
    clearSession();
    await signOut();
  };
};
