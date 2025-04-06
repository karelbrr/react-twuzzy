import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Users } from "lucide-react";
import { supabase } from "../my-hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";

interface GroupMembers {
  id: string;
  created_at: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export function GroupShowPeople({
  group_id,
}: {
  group_id: string;
  created_by: string;
}) {
  const { user } = useAuth();
  const fetchGroups = async (): Promise<GroupMembers[]> => {
    const { data, error } = await supabase
      .from("group_members")
      .select(
        `
            *,
            profiles (
              id,
              first_name,
              last_name
            )
          `
      )
      .eq("group_id", group_id);

    if (error) throw new Error(error.message);

    return data;
  };

  const {
    data: groupMembers,
    error: errorQuery,
    isLoading,
  } = useQuery<GroupMembers[], Error>({
    queryKey: ["fetchGroupsMembersForGroupList"],
    queryFn: fetchGroups,
  });

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Users className="w-4 h-4 " />
        Show People
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent>
        <DropdownMenuLabel>Creator</DropdownMenuLabel>
        <DropdownMenuItem>
          <span></span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {groupMembers?.map(
          (member) =>
            member.user_id !== user?.id && (
              <DropdownMenuItem key={member.id}>
                <span>
                  {member.profiles.first_name} {member.profiles.last_name}
                </span>
              </DropdownMenuItem>
            )
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
