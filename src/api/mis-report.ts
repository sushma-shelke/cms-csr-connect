import api from "./axios";

export const getMISReports = async () => {
  const res = await api.get("/api/mis-reports");
  return res.data;
};

export const getMISReportById = async (id: string) => {
  const res = await api.get(`/api/mis-reports/${id}`);
  return res.data;
};

export const getMISReportsByProject = async (projectId: string) => {
  const res = await api.get(`/api/mis-reports/project/${projectId}`);
  return res.data;
};

export const createMISReport = async (report: unknown) => {
  const res = await api.post("/api/mis-reports", report);
  return res.data;
};

export const updateMISReport = async (id: string, report: unknown) => {
  const res = await api.put(`/api/mis-reports/${id}`, report);
  return res.data;
};

export const deleteMISReport = async (id: string) => {
  const res = await api.delete(`/api/mis-reports/${id}`);
  return res.data;
};

export const approveMISReport = async (id: string) => {
  const res = await api.post(`/api/mis-reports/${id}/approve`);
  return res.data;
};

export const rejectMISReport = async (id: string, reason: string) => {
  const res = await api.post(`/api/mis-reports/${id}/reject`, { reason });
  return res.data;
};
