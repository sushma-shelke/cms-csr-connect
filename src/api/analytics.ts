import api from "./axios";

// Get project analytics
export const getProjectAnalytics = async () => {
  try {
    const res = await api.get("/api/projects/analytics");
    return res.data;
  } catch (error) {
    console.warn('Project analytics API not available, returning default data');
    // Return default data when API fails
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      pendingReports: 0,
      averageAchievement: 0
    };
  }
};

// Get total budget
export const getTotalBudget = async () => {
  try {
    const res = await api.get("/api/projects/total-budget");
    return res.data;
  } catch (error) {
    console.warn('Total budget API not available, returning default data');
    return 0;
  }
};

// Get budget utilized
export const getBudgetUtilized = async () => {
  try {
    const res = await api.get("/api/projects/budget-utilized");
    return res.data;
  } catch (error) {
    console.warn('Budget utilized API not available, returning default data');
    return 0;
  }
};

// Get total beneficiaries
export const getTotalBeneficiaries = async () => {
  try {
    const res = await api.get("/api/projects/total-beneficiaries");
    return res.data;
  } catch (error) {
    console.warn('Total beneficiaries API not available, returning default data');
    return 0;
  }
};

// Get project count by status
export const getProjectCountByStatus = async () => {
  try {
    const res = await api.get("/api/projects/count/status");
    return res.data;
  } catch (error) {
    console.warn('Project count by status API not available, returning default data');
    // Return default data when API fails
    return {
      "Completed": 0,
      "In Progress": 0,
      "At Risk": 0,
      "Not Started": 0
    };
  }
};

// Get project count by theme
export const getProjectCountByTheme = async () => {
  try {
    const res = await api.get("/api/projects/count/theme");
    return res.data;
  } catch (error) {
    console.warn('Project count by theme API not available, returning default data');
    // Return default data when API fails
    return {
      "Health": 0,
      "Education": 0,
      "Livelihood": 0,
      "Environment": 0,
      "Social Welfare": 0
    };
  }
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
