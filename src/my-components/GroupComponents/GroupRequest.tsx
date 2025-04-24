import { useQuery } from "@tanstack/react-query";
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

export const GroupRequest = () => {
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

  return (
    <section className="mt-2">
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
                <DropdownMenuItem>
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
  );
};
