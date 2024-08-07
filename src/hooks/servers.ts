import { create } from "zustand";

export type ServerType = {
  id: string;
  icon: string | null;
  name: string | null;
  public: boolean | null;
  ownerId: string;
};

type Servers = {
  servers: ServerType[];
  addNewServer: (server: ServerType) => void;
  loadServers: (servers: ServerType[]) => void;
};

export const useServers = create<Servers>()((set) => ({
  servers: [],
  addNewServer: (server) =>
    set((prev) => ({ servers: [...prev.servers, server] })),
  loadServers: (servers) => set({ servers }),
}));
