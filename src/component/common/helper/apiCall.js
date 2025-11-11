import axios from "axios";

const baseURL = "http://localhost:5000";

// Reusable API call function with query parameters
export const apiCall = async (
  url,
  method = "GET",
  data = null,
  headers = {},
  params = {}
) => {
  try {
    const API_Point = baseURL + url;

    const response = await axios({
      url: API_Point,
      method,
      data,
      headers,
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("API Call Error:", error);

    // Throw a user-friendly error message
    throw error.response
      ? error.response.data
      : "An unexpected error occurred.";
  }
};
