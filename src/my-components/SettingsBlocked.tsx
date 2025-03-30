import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Ban } from "lucide-react";
import { supabase } from "./my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";
import { formatDate } from "./my-hooks/formatDate";
import { Skeleton } from "@/components/ui/skeleton";

interface BlockedUser {
  id: number;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
  blocked_user: {
    id: string;
    first_name: string;
    last_name: string;

  };
}

export const SettingsBlocked = () => {
  const { user } = useAuth();

  const fetchBlockedUsers = async (): Promise<BlockedUser[]> => {
    const { data, error } = await supabase
      .from("blocked_users")
      .select(
        `
    *,
    blocked_user: profiles!blocked_id (id,first_name, last_name)
  `
      )
      .eq("blocker_id", user?.id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const {
    data: blockedUsers,
    error: errorQuery,
    isLoading,
  } = useQuery<BlockedUser[], Error>({
    queryKey: ["fetchBlockedUsers"],
    queryFn: fetchBlockedUsers,
  });

  return (
    <section>
      <h2 className="font-bold text-2xl mt-10 mb-5 mx-10 ">Blocked People</h2>
      <div className="ml-10 grid grid-cols-2 gap-y-3 gap-3">
        {errorQuery && (
          <div className="border border-red-700 mt-2 p-3 text-red-700 rounded-lg">
            <h4>Error</h4>
            <p>{errorQuery.message}</p>
          </div>
        )}
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Alert key={i} className="mb-4">
              <Ban className="h-4 w-4" />
              <div className="flex justify-between items-start">
                <div>
                  <AlertTitle className="flex space-x-2">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-28 h-4" />
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    <Skeleton className="w-72 h-3" />
                  </AlertDescription>
                </div>
                <Button disabled variant="outline">
                  Unblock
                </Button>
              </div>
            </Alert>
          ))
        ) : blockedUsers?.length ? (
          blockedUsers.map((user) => (
            <Alert key={user.id} className="mb-4">
              <Ban className="h-4 w-4" />
              <div className="flex justify-between items-start">
                <div>
                  <AlertTitle>
                    {user.blocked_user.first_name} {user.blocked_user.last_name}
                  </AlertTitle>
                  <AlertDescription>
                    This user was blocked at {formatDate(user.created_at)}
                  </AlertDescription>
                </div>
                <Button variant="outline">Unblock</Button>
              </div>
            </Alert>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No blocked users found.
          </p>
        )}
      </div>
    </section>
  );
};
