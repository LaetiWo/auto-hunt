import { getCurrentUserQueryFn } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUserQueryFn,
  });
};

export default useCurrentUser;
