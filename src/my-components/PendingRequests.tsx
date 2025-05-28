import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "./my-hooks/createClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {Error as ErrorDiv} from "./Error";
export function PendingRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fetchPendingRequests = async () => {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
          *,
          profiles:chat_with (
            id,
            first_name,
            last_name,
            avatar
          )
        `
      )
      .eq("is_started", false)
      .eq("created_by", user?.id);

    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data: pendingRequestsData,
    error: errorQuery,
    isLoading,
  } = useQuery({
    queryKey: ["pendingRequests"],
    queryFn: fetchPendingRequests,
  });

  const deleteRequest = async (id: string) => {
    const { error } = await supabase.from("chats").delete().eq("id", id);
    if (error) throw new Error(error.message);
  };

  const { mutate: handleDelete } = useMutation({
    mutationFn: async (id: string) => {
      await deleteRequest(id);
    },
    onSuccess: () => {
      toast({
        description: "Request deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["pendingRequests"] });
    },
    onError: () => {
      toast({
        description: "Failed to delete the request.",
        variant: "destructive",
      });
    },
  });

  return (
    <section>
      <h3 className="font-semibold">Pending Requests</h3>
      {pendingRequestsData?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No pending requests found.
        </p>
      )}
      {errorQuery && (
        <ErrorDiv error={errorQuery?.message} />
      )}
      {pendingRequestsData?.map((item) => (
        <div
          key={item.id}
          className="flex justify-between border p-2 rounded-lg"
        >
          <p className="text-sm">
            {item.profiles.first_name} {item.profiles.last_name}
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis size={17} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <p>
                  {item.profiles.first_name} {item.profiles.last_name}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleDelete(item.id)}>
                <X size={16} /> Delete Request
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/profile/${item.profiles.id}`}>
                  <User size={16} /> Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </section>
  );
}
