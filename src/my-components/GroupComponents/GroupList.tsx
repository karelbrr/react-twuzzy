import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, LogOut, Settings } from "lucide-react";
import { supabase } from "../my-hooks/createClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Error as ErrorDiv } from "../Error";
import { GroupShowPeople } from "./GroupShowPeople";
import { toast } from "@/hooks/use-toast";

interface Group {
  id: string;
  created_at: string;
  updated_at: string;
  group_name: string;
  created_by: string;
  is_public: string;
  avatar_url: string;
  description: string;
}

export const GroupList = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const fetchGroups = async (): Promise<Group[]> => {
    const { data: createdGroups, error: error1 } = await supabase
      .from("groups")
      .select("*")
      .eq("created_by", user?.id);

    if (error1) throw new Error(error1.message);

    const { data: memberGroups, error: error2 } = await supabase
      .from("group_members")
      .select(
        `
        group_id,
        groups (*)
      `
      )
      .eq("user_id", user?.id)
      .eq("is_joined", true);

    if (error2) throw new Error(error2.message);

    const joinedGroups = memberGroups?.map((item) => item.groups);

    const allGroups = [...(createdGroups || []), ...(joinedGroups || [])];

    const uniqueGroups = allGroups.filter(
      (group, index, self) => index === self.findIndex((g) => g.id === group.id)
    );

    // Lokální řazení podle updated_at (od nejnovějších)
    const sortedGroups = uniqueGroups.sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    return sortedGroups;
  };

  const {
    data: myGroups,
    error: errorQuery,
    isLoading,
  } = useQuery<Group[], Error>({
    queryKey: ["fetchGroupsForGroupList"],
    queryFn: fetchGroups,
  });

  const leaveGroup = async (id: string) => {
    const { data, error } = await supabase
      .from("group_members")
      .delete()
      .eq("user_id", user?.id)
      .eq("group_id", id);
    if (error) throw new Error(error.message);
    return data;
  };

  const { mutate } = useMutation({
    mutationFn: leaveGroup,
    onSuccess: () => {
      toast({
        description: "You have left the group.",
        duration: 2000,
      });
      queryClient.invalidateQueries({ queryKey: ["fetchGroupsForGroupList"] });
    },
  });
  const handleLeaveGroup = (id: string) => {
    if (user?.id) mutate(id);
  };

  return (
    <div className="m-auto w-[90%] mt-4 ml-5">
      {myGroups?.map((group) => (
        <Button
          key={group.id}
          asChild
          variant="outline"
          className={`w-full flex justify-start rounded-lg z-0  h-16 mb-3 ${
            group.id === id && "bg-secondary opacity-90"
          }
        }`}
        >
          <Link to={`group/${group.id}`}>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center ">
                <Avatar className="size-10 max-h-12 max-w-12 ">
                  <AvatarImage src={group.avatar_url} />
                  <AvatarFallback>
                    {group.group_name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <p className="ml-2">{group.group_name}</p>
              </div>
              <div className="">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis className="mt-2" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-20">
                    <DropdownMenuLabel>{group.group_name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <GroupShowPeople
                      group_id={group.id}
                      created_by={group.created_by}
                    />

                    {group.created_by === user?.id && (
                      <DropdownMenuItem asChild>
                        <Link
                          to={`/group/${group.id}/settings`}
                          className="flex items-center"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {group.created_by !== user?.id && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="text-red-700 focus:text-red-700 flex items-center">
                          <LogOut className="w-4 h-4 " />
                          Leave Group
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuLabel>Leave group?</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-700 focus:text-red-700 flex items-center"
                              onClick={() => handleLeaveGroup(group.id)}
                            >
                              Yes
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Link>
        </Button>
      ))}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
        </div>
      )}
      {errorQuery && <ErrorDiv error={errorQuery?.message} />}
    </div>
  );
};
