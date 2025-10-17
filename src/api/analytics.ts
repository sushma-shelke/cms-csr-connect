import api from "./axios";

// Get project analytics
export const getProjectAnalytics = async () => {
  const res = await api.get("/api/projects/analytics");
  return res.data;
};

// Get total budget
export const getTotalBudget = async () => {
  const res = await api.get("/api/projects/total-budget");
  return res.data;
};

// Get budget utilized
export const getBudgetUtilized = async () => {
  const res = await api.get("/api/projects/budget-utilized");
  return res.data;
};

// Get total beneficiaries
export const getTotalBeneficiaries = async () => {
  const res = await api.get("/api/projects/total-beneficiaries");
  return res.data;
};

// Get project count by status
export const getProjectCountByStatus = async () => {
  const res = await api.get("/api/projects/count/status");
  return res.data;
};

// Get project count by theme
export const getProjectCountByTheme = async () => {
  const res = await api.get("/api/projects/count/theme");
  return res.data;
};

// Get projects by status
export const getProjectsByStatus = async (status: string) => {
  const res = await api.get(`/api/projects/status/${status}`);
  return res.data;
};

// Get projects by theme
export const getProjectsByTheme = async (theme: string) => {
  const res = await api.get(`/api/projects/theme/${theme}`);
  return res.data;
};
