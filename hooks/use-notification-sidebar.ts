import { create } from "zustand";

interface NotificationSidebarStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useNotificationSidebar = create<NotificationSidebarStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useNotificationSidebar;
