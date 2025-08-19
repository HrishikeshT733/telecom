// src/api/billApi.js
import axios from "./axiosConfig";

// Get all bills (Admin)
export const getAllBills = () =>
  axios.get(`api/bills/all`).then((res) => res.data);

// Get bills for a specific customer (User)
export const getBillsByCustomer = (customerId) =>
  axios.get(`api/bills/customer/${customerId}`).then((res) => res.data);

// Generate monthly bills for all postpaid customers (Admin)
export const generateMonthlyBills = () =>
  axios.post(`api/bills/generate`).then((res) => res.data);

// Pay a specific bill (User)
export const payBill = (customerId, billId) =>
  axios.post(`api/bills/pay/${customerId}/${billId}`).then((res) => res.data);

// Recharge prepaid SIM (User)
export const rechargeSim = (rechargeRequest) =>
  axios.post(`api/bills/recharge`, rechargeRequest).then((res) => res.data);
// Pay a specific bill and continue same plan (User)
export const payBillToContinueSamePlan = (customerId, billId, rechargeRequest = {}) =>
  axios.post(`api/bills/payBilltoContinueSamePlan/${billId}`, rechargeRequest).then((res) => res.data);

// Pay a specific bill and change plan (User)
export const payBillToChangePlan = (customerId, billId, rechargeRequest = {}) =>
  axios.post(`api/bills/payBilltoChangePlan/${billId}`, rechargeRequest).then((res) => res.data);

// // src/api/billApi.js
// import axios from "./axiosConfig";

// // Get all bills (Admin)
// export const getAllBills = () =>
//   axios.get(`api/bills/all`).then((res) => res.data);

// // Get bills for a specific customer (User)
// export const getBillsByCustomer = (customerId) =>
//   axios.get(`api/bills/customer/${customerId}`).then((res) => res.data);

// // Generate monthly bills for all postpaid customers (Admin)
// export const generateMonthlyBills = () =>
//   axios.post(`api/bills/generate`).then((res) => res.data);



// // Recharge prepaid SIM (User)
// export const rechargeSim = (rechargeRequest) =>
//   axios.post(`api/bills/recharge`, rechargeRequest).then((res) => res.data);
