import axios from "axios";

const API_URL = "http://localhost:5000/api/reports";

export const downloadReportCSV = async (token) => {
  const response = await axios.get(`${API_URL}/export`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob", // IMPORTANT for file download
  });

  return response.data;
};
