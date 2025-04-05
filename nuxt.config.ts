// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // app: {
  //   head: {
  //     // title: "",
  //     // link: [
  //     //   {
  //     //     rel: "icon",
  //     //     href: "",
  //     //   },
  //     // ],
  //     meta: [
  //       // {
  //       //   name: "theme-color",
  //       //   content: "#5C0099",
  //       // },
  //     ],
  //   },
  // },
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL,
    },
  },
  css: ["~/assets/scss/main.scss"],
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // router: {
  //   extendRoutes(routes, resolve) {
  //     routes.push({
  //       name: '404',
  //       path: '*',
  //       component: resolve(__dirname, 'layouts/error.vue')
  //     })
  //   }
  // },
});