import { create } from 'zustand';
const useAnimeStore = create((set) => ({
    title: '',
    sort: '',
    status: '',
    setTitle: (title) => set({ title }),
    setSort: (sort) => set({ sort }),
    setStatus: (status) => set({ status })
}))
export default useAnimeStore;