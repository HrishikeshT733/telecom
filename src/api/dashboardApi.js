import axios from "./axiosConfig";

export const resetSimulationDate = () =>
  axios.post(`api/dashboard/reset`).then((res) => res.data);
export const getSimulationDate = () =>
  axios.get(`api/dashboard/date`).then((res) => res.data);