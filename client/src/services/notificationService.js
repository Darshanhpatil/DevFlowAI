import api from "./api.js";

export const getNotifications = () =>
  api.get("/notifications");

export const markNotificationRead = (id) =>
  api.put(`/notifications/${id}`);