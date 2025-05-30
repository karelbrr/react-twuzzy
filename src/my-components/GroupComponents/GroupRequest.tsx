import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "../my-hooks/createClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, X } from "lucide-react";
import { Ellipsis } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Error as ErrorDiv } from "../Error";
import { toast } from "@/hooks/use-toast";

export const GroupRequest = ({
  chatRequestLength,
}: {
  chatRequestLength: number | undefined;
}) => {
  // můžeš teď použít chatRequestLength jako číslo
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const fetchGroupRequests = async () => {
    const { data, error } = await supabase
      .from("group_members")
      .select(
        `
            *,
            groups!group_id (
              id,
              group_name,
              avatar_url
            )
          `
      )
      .eq("is_joined", false)
      .eq("user_id", user?.id);

    if (error) throw new Error(error.message);

    return data;
  };

  const {
    data: myGroupRequestsData,
    error: errorQuery,
    isLoading,
  } = useQuery({
    queryKey: ["GroupRequest"],
    queryFn: fetchGroupRequests,
  });

  const acceptRequest = async (memberId: string) => {
    const { data, error } = await supabase
      .from("group_members")
      .update({ is_joined: true })
      .eq("id", memberId);

    if (error) throw new Error(error.message);
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: acceptRequest,
    onError: () => console.log("error"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GroupRequest"] });
    },
  });

  const sendAcceptRequest = (chatId: string) => {
    mutate(chatId);
  };

  const deleteRequest = async (id: string) => {
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  };
  const { mutate: handleDelete } = useMutation({
    mutationFn: async (id: string) => {
      await deleteRequest(id);
    },
    onSuccess: () => {
      toast({
        description: "Request declined successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["GroupRequest"] });
    },
    onError: () => {
      toast({
        description: "Failed to decline the request.",
        variant: "destructive",
      });
    },
  });

  const sendDeclineRequest = (chatId: string) => {
    handleDelete(chatId);
  };

  return (
    <>
      <h3 className="font-semibold mt-2">Groups</h3>
      {myGroupRequestsData?.length === 0 ? (
        <p className="text-sm font-medium ">No chat requests</p>
      ) : (
        <section className="">
          {errorQuery && <ErrorDiv error={errorQuery.message} />}
          <div className="space-y-2">
            {myGroupRequestsData?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border p-2 rounded-lg"
              >
                <p className="text-sm">{item.groups.group_name}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis size={17} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      <p>{item.groups.group_name}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => sendAcceptRequest(item.id)}
                    >
                      <Check size={16} /> Accept Request
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => sendDeclineRequest(item.id)}
                    >
                      <X size={16} /> Decline Request
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
