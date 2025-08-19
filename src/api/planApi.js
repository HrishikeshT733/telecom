// src/api/planApi.js
import axios from "./axiosConfig";

export const getAllPlans = () =>
  axios.get(`api/plans`).then((res) => res.data);

export const getPlanById = (planId) =>
  axios.get(`api/plans/${planId}`).then((res) => res.data);

export const createPlan = (planData) =>
  axios.post(`api/plans`, planData).then((res) => res.data);

export const updatePlan = (planId, planData) =>
  axios.put(`api/plans/${planId}`, planData).then((res) => res.data);

export const deletePlan = (planId) =>
  axios.delete(`api/plans/${planId}`).then((res) => res.data);
