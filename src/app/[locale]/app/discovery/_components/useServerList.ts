import { useServers } from "@/hooks/servers";
import { useRouter } from "@/navigation";
import { api } from "@/trpc/react";

export function useServerListBusiness() {
  const router = useRouter();
  const { addNewServer } = useServers();
  const { data: servers, isLoading } = api.server.getPublicServers.useQuery();
  const joinServer = api.server.join.useMutation();

  const handleJoin = async (serverId: string) => {
    try {
      const data = await joinServer.mutateAsync({ serverId });
      addNewServer({
        id: data.serverId,
        name: data.name,
        icon: null,
        public: true,
        ownerId: "",
      });
      router.push(`/app/servers/${data.serverId}`);
    } catch (error) {
    
      console.error("Error joining server:", error);
    }
  };

  return {
    servers,
    isLoading,
    handleJoin,
    joinServer,
    router,
  };
}
