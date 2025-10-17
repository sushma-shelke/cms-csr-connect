import api from "./axios";

export const getProjects = async () => {
  const res = await api.get("/api/projects");
  return res.data;
};

export const getProjectById = async (id: number) => {
  const res = await api.get(`/api/projects/${id}`);
  return res.data;
};

export const getProjectPerformanceMetrics = async (id: number) => {
  const res = await api.get(`/api/projects/${id}/performance`);
  return res.data;
};

// export const createProject = async (project: unknown) => {
//   const res = await api.post("/api/projects", project);
//   return res.data;
// };

// export const updateProject = async (id: number, project: unknown) => {
//   const res = await api.put(`/api/projects/${id}`, project);
//   return res.data;
// };

export const deleteProject = async (id: number) => {
  const res = await api.delete(`/api/projects/${id}`);
  return res.data;
};
