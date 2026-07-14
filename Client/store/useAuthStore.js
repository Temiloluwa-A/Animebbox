import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// keeps the logged-in user + token, saved to localStorage so a refresh stays logged in
const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: ({ user, token }) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
        }),
        { name: 'auth' }
    )
)

export default useAuthStore
