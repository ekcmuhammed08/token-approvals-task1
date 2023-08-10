import { create } from 'zustand'

export const useApprovalStore = create((set) => ({
  allowanceList: [],
  setAllowance: (arr) => set((state) => ({ allowanceList: state.allowanceList = arr })),
}))