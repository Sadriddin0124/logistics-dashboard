import { $apiAuth } from "@/pages/api/api";
import { LoginTypes } from "../types/auth.types";


export const LoginUser = async (data: LoginTypes) => {
    const response = await $apiAuth.post("/auth/token", data);
    return response.data;
  };

