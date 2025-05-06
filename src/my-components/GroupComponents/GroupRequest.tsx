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
import { Check, X, User, Ban } from "lucide-react";
import { Link } from "react-router-dom";
import { Ellipsis } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Error as ErrorDiv } from "../Error";


export const GroupRequest = () => {
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

  return (
    <>
      {myGroupRequestsData?.length !== 0 && (
        <section className="">
          <h3 className="font-semibold mt-2">Groups</h3>
          {errorQuery && (<ErrorDiv error={errorQuery.message}/>)}
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

                    <DropdownMenuItem>
                      <X size={16} /> Decline Request
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/profile/${item.id}`}>
                        <User size={16} /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-700 focus:text-red-700">
                      <Ban size={16} /> Block
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
