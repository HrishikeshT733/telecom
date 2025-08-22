import axios from "./axiosConfig";

export const applySim = (simData, customerId, planId) =>
  axios.post(`api/sim/apply`, simData, {
    params: { customerId, planId },
  }).then((res) => res.data);

export const getPendingSims = () =>
  axios.get(`api/sim/pending`).then((res) => res.data);

export const approveSim = (simId) =>
  axios.put(`api/sim/${simId}/approve`).then((res) => res.data);

export const rejectSim = (simId) =>
  axios.put(`api/sim/${simId}/reject`).then((res) => res.data);

export const viewAllSim = (customerId) =>
  axios.get(`api/sim/customer/${customerId}`).then((res) => res.data);

export const simById = (simId) =>
  axios.get(`api/sim/${simId}`).then((res) => res.data);

export const changePlanPostpaid = (simId, planData) =>
  axios.post(`api/sim/changePlanPostPaid/${simId}`, planData)
       .then((res) => res.data);

       export const ActivateNewPlanPostpaid = (simId,planData) =>
  axios.post(`api/sim/ActivateNewPlanPostpaid/${simId}`,planData)
       .then((res) => res.data);


       
export const getAllSims = () =>
  axios.get(`api/sim/getAllSims`).then((res) => res.data);//Admin only