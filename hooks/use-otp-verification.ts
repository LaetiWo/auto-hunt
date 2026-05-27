import { create } from "zustand";

interface OtpVerificationStore {
  open: boolean;
  userId: string;
  email: string;
  show: (userId: string, email: string) => void;
  hide: () => void;
}

const useOtpVerification = create<OtpVerificationStore>((set) => ({
  open: false,
  userId: "",
  email: "",
  show: (userId, email) => set({ open: true, userId, email }),
  hide: () => set({ open: false, userId: "", email: "" }),
}));

export default useOtpVerification;
