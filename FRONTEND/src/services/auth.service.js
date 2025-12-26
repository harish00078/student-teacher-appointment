import api from "./api";

export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const register = async (data) => {
  await api.post("/auth/register", data);
};
