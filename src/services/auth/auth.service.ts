import { API } from "@/config";
import { RegisTerTypes, LoginTypes } from "./type";

export const RegisterApi = async (data: RegisTerTypes) => {
  const response = await API.post("/register", data);
  return response?.data;
};
export const LoginApi = async (data: LoginTypes) => {
  const response = await API.post("/login", data);
  return response?.data;
};
