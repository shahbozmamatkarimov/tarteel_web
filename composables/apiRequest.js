import axios from 'axios';

export default function apiRequest(options) {
  const config = useRuntimeConfig()
  const token = useCookie('access_token');
  const router = useRouter()
  console.log(config.public.baseURL, 2303);
  const api = axios.create({
    baseURL: config.public.baseURL,
    timeout: 10000,
  });

  api.interceptors.request.use(
    config => {
      if (token.value) {
        config.headers['Authorization'] = 'Bearer ' + token.value;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    response => {
      const res = response.data;
      if (response.status !== 200) {
        return Promise.reject(new Error(res.message || 'Error'));
      } else {
        return res['data'];
      }
    },
    error => {
      if (error.response && (error.response.status == 401)) {
        token.value = null;
        router.push('/auth/login');
      }
      return Promise.reject(error.response);
    }
  );

  return api(options);
};
