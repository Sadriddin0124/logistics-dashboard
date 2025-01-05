import { $api, $apiAuth } from "@/pages/api/api";
import { LoginTypes } from "../types/auth.types";

export const LoginUser = async (data: LoginTypes) => {
  const response = await $apiAuth.post("/auth/token", data);
  return response.data;
};

export const LogoutUser = async () => {
  const response = await $api.post("/auth/logout", {auth_token: localStorage.getItem("accessToken")});
  return response.data;
};
