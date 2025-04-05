import {defineStore} from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
      user: null,
      is_auth: false,
    }),
    getters: {
      USER: (state) => state.user,
      IS_AUTH: (state) => state.is_auth,
    },
    actions: {
      async login(data) {
        const res = await apiRequest({
          url: `/auth/login`,
          method: 'post',
          data
        });
        const token = useCookie('access_token');
        token.value = res['access_token'];
        return res;
      },
      async getCurrentUser() {
        const res = await apiRequest({
          url: `/auth/me`,
          method: 'post'
        });
        this.user = res;
        this.is_auth = true;
        return res;
      },
      async logout(data) {
        const res = await apiRequest({
          url: `/auth/logout`,
          method: 'post'
        });
        const token = useCookie('access_token');
        token.value = null;
        return res;
      },
    },
})