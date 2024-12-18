import { $api, $apiAuth } from "@/pages/api/api";
import { ChangePasswordType, LoginTypes } from "@/types/auth";

export const LoginUser = async (data: LoginTypes) => {
    const response = await $apiAuth.post("/moderator/login", data);
    return response.data;
  };

export const ChangePassword = async (data: ChangePasswordType) => {
    const response = await $api.post("/auth/change_password", data);
    return response.data;
  };

export const fetchMe = async () => {
    const response = await $api.get("/moderator/me");
    return response.data;
  };