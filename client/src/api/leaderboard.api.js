import { apiFetch } from "./api";

export const getLeaderboard = async () => {
  try {
    const response = await apiFetch(`/leaderboard`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};
