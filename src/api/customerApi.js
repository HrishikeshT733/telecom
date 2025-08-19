import axios from "./axiosConfig";

export const getAllCustomer = () =>
  axios.get(`api/customer/getAllCustomer`).then((res) => res.data);

export const getCustomerById = (CustomerId) =>
  axios.get(`api/customer/getCustomerById/${CustomerId}`).then((res) => res.data);
