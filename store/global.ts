import { defineStore } from 'pinia'

export const useGlobalStore = defineStore('global', () => {
  const count = ref(0)
  const user = ref(null as null | { name: string; email: string })

  const increment = () => {
    count.value++
  }

  const setUser = (userData: { name: string; email: string }) => {
    user.value = userData
  }

  return {
    count,
    user,
    increment,
    setUser
  }
})
