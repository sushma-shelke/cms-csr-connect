import api from "./axios";

export const getNgos = async () => {
  const res = await api.get("/api/ngos");
  return res.data;
};

export const getNgosById = async (id: number) => {
  const res = await api.get(`/api/ngos/${id}`);
  return res.data;
};

export const createNgos = async (project: unknown) => {
  const res = await api.post("/api/ngos", project);
  return res.data;
};

export const updateNgos = async (id: number, project: unknown) => {
  const res = await api.put(`/api/ngos/${id}`, project);
  return res.data;
};

export const deleteNgos = async (id: number) => {
  const res = await api.delete(`/api/ngos/${id}`);
  return res.data;
};
