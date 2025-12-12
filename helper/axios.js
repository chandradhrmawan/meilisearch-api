import axios from 'axios';

const instance = axios.create();

instance.interceptors.request.use((request) => {
  request.meta = request.meta || {};
  request.meta.requestStartedAt = Date.now();
  return request;
});

instance.interceptors.response.use((response) => {
  const durationInMs = Date.now() - response.config.meta.requestStartedAt;
  console.log(JSON.stringify({
    code: response.status,
    method: response.request.method,
    host: response.request.host,
    path: response.request.path,
    duration: durationInMs,
    contentLength: Number.parseInt(response.headers['content-length']),
  }));

  return response;
});

export default instance;
