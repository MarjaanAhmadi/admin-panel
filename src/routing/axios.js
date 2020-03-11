import axios from "axios";
import {toast} from "react-toastify";
import i18next from "i18next";

//define an instance from Axios and set headers and baseurl => because we are using proxy we can't set base url

let axiosInstance = axios.create({
  timeout: 1100000,
  // baseURL:'https://testbed.nexfon,ir/',
  headers: {}
});
axiosInstance.interceptors.response.use(null, (error) => {
  if (error.response.status === 500) {
    toast.error(i18next.t('ServerError'));
  }
  if (error.response.status === 400) {
    toast.error(i18next.t('BadData'));
  }
  if (error.response.status === 401) {
    debugger

    localStorage.removeItem('highway-token');
    window.location.href='/login';
  }

  return Promise.reject(error)
});

export default axiosInstance;
