import api from "./axios";

// Define NGO type
export interface NGO {
  name: string;
  address: string;
  // Add other relevant fields here
}

// Fetch all NGOs
export const fetchNGOs = async () => {
  const { data } = await api.get("/ngos");
  return data;
};

// Add a new NGO
export const addNGO = async (ngo: NGO) => {
  const { data } = await api.post("/ngos", ngo);
  return data;
};
