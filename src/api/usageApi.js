// src/api/usageApi.js
import axios from "./axiosConfig";

// Admin - Get All Usages
export const getAllUsages = () =>
  axios.get(`api/usages/all`).then((res) => res.data);

// Admin - Get Usage by SIM ID
export const getUsageBySimId = (simId) =>
  axios.get(`api/usages/sim/${simId}`).then((res) => res.data);

// User - Get My Usages
export const getMyUsages = () =>
  axios.get(`api/usages/my`).then((res) => res.data);
