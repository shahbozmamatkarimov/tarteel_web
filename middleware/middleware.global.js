import { defineNuxtRouteMiddleware } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    if (process.client) {
      const token = localStorage.getItem("token");
      if (token) {
        const parts = token.split(".");
        const exp = parts[1];
        const decodedPayload = JSON.parse(atob(exp));
        const experition = decodedPayload.exp;
        const now = +Date.now().toString().slice(0, 10);
        if (now >= experition) {
          localStorage.removeItem("token");
        } else {
        }
      } else if (localStorage.hasOwnProperty("user_id")) {
      }
    }
  } catch (error) {
    if (
      localStorage.hasOwnProperty("user_id") ||
      localStorage.hasOwnProperty("token")
    ) {
    }
    console.log(error);
  }
});
