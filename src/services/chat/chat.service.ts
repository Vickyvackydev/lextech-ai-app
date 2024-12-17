import { API } from "@/config";

export const SendMessage = async (text: FormData) => {
  const response = await API.post("/chat", text, {
    headers: { "Content-Type": "multipart/formdata" },
  });
  return response?.data;
};

export const getChats = async () => {
  const response = await API.get("/chat");
  return response?.data?.data;
};
