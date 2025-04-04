import { useOkto } from "@okto_web3/react-sdk";
import Cookies from "js-cookie";

export const useOktoClient = () => {
  const oktoClient = useOkto();

  const getAccessToken = () => {
    return Cookies.get("accessToken");
  };

  const setAccessToken = (token: string) => {
    Cookies.set("accessToken", token);
  };

  const clearSession = () => {
    oktoClient.sessionClear();
  };

  return { getAccessToken, setAccessToken, clearSession };
};
