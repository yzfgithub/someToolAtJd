import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: ''
});

axiosInstance.defaults.timeout = 30000;
axiosInstance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axiosInstance.interceptors.request.use(
  req => {
    Object.assign(req.headers.common, { 'dsm-platform': 'pc' });
    return req;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  res => {
    const result = res.data.data;
    return result;
  },
  error => {
    return Promise.reject(error);
  }
);

export default function (config) {
  if (config.data) {
    config.data = { baseRequest: config.data };
  }
  if (!config.transformResponse) {
    config.transformResponse = [];
  }
  Array.isArray(config.transformResponse) &&
    config.transformResponse.push(data => {
      return {
        ...JSON.parse(data || '{}'),
        errorTitle: config.errorTitle
      };
    });

  return axiosInstance(config).catch(function (res) {
    return res;
  });
}
