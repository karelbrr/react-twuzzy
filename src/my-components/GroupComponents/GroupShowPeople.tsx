import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { ShieldCheck, Users } from "lucide-react";
import { supabase } from "../my-hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface GroupMembers {
  id: string;
  created_at: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  is_joined: boolean;
  is_verified: boolean;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

interface GroupCreator {
  id: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
  }[];
}

export function GroupShowPeople({
  group_id,
}: {
  group_id: string;
  created_by: string;
}) {
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

  const { data: groupMembers, error: errorQuery } = useQuery<
    GroupMembers[],
    Error
  >({
    queryKey: ["fetchGroupsMembersForGroupList"],
    queryFn: fetchGroups,
  });

  const fetchGroupCreator = async (): Promise<GroupCreator> => {
    const { data, error } = await supabase
      .from("groups")
      .select(
        `
          id,
          created_by,
          profiles (
            id,
            first_name,
            last_name
          )
        `
      )
      .eq("id", group_id)
      .single();

    if (error) throw new Error(error.message);

    return data;
  };

  const { data: groupCreator, error: errorQueryCreator } = useQuery<
    GroupCreator,
    Error
  >({
    queryKey: ["fetchGroupCreatorForGroupList"],
    queryFn: fetchGroupCreator,
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
          <Link to={`/profile/${groupCreator?.profiles.id}`}>
            <span>
              {errorQueryCreator && <span>{errorQueryCreator.message}</span>}
              {groupCreator?.profiles?.first_name}{" "}
              {groupCreator?.profiles?.last_name}
            </span>
          </Link>
        </DropdownMenuItem>
        {groupMembers?.length !== 0 && <DropdownMenuSeparator />}
        {errorQuery && <span>{errorQuery.message}</span>}

        {groupMembers?.map((member) => (
          <DropdownMenuItem key={member.id}>
            <Link to={`/profile/${member.profiles.id}`}>
              <span className="flex items-center">
                {member.is_verified && <ShieldCheck className="mr-1"/>}
                {member.profiles.first_name} {member.profiles.last_name}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
