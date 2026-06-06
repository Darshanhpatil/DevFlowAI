import axios from "axios";

const API = "http://localhost:5000/api/activity";

const getToken = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getActivities = async () => {
  const res = await axios.get(
    API,
    getToken()
  );

  return res.data;
};