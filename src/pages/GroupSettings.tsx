import { GroupSettingsUser } from "./../my-components/GroupSettingsUser";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FindNewPeople } from "@/my-components/FindNewPeople";
import { supabase } from "@/my-components/my-hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
//vyresit aby se tady nemohl nikdo dostat bez prihlaseni nebo created_by

interface GroupMembers {
  id: string;
  created_at: string;
  is_joined: string;
  is_verified: string;
  group_id: string;
  user_id: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export const GroupSettings = () => {
  const { id } = useParams();

  const fetchGroupMembers = async (): Promise<GroupMembers[]> => {
    const { data, error } = await supabase
      .from("group_members")
      .select(
        `
              *,
              profiles (
                id,
                first_name,
                last_name,
                avatar
              )
            `
      )
      .eq("group_id", id);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const {
    data: groupMembers,
    error,
    isLoading,
  } = useQuery<GroupMembers[], Error>({
    queryKey: ["fetchGroupMembers", id],
    queryFn: fetchGroupMembers,
  });

  return (
    <div className="h-[80%] lg:h-[72] xl:h-[80%] w-[82%] mt-24 ">
      <motion.section
        className="h-[94%] flex-col  overflow-auto pl-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
      >
        <h2 className="font-bold text-2xl mt-5 ">Group Settings</h2>
        <p className="text-muted-foreground mb-4">
          Manage your group visibility, members, and other preferences here.
        </p>
        <section className="space-y-5">
          <div className="flex flex-col gap-1.5 w-1/2 ">
            <Label htmlFor="first_name" className="text-md">
              Group Name
            </Label>
            <Input className="" placeholder="Group Name" />
          </div>
          <div className="flex flex-col gap-1.5 w-1/2">
            <Label htmlFor="first_name" className="text-md">
              Group Description
            </Label>
            <Input className="" placeholder="Short Group Description" />
          </div>
          <div className="flex flex-col gap-1.5 w-1/2">
            <Label className="text-md">Group Visibility</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Public" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-md">Users</Label>
            <div className="space-y-2 my-2">
              {groupMembers?.map((item) => (
                <GroupSettingsUser
                  key={item.id}
                  id={item.profiles.id}
                  first_name={item.profiles.first_name}
                  last_name={item.profiles.last_name}
                  is_verified={item.is_verified}
                />
              ))}
            </div>

            <FindNewPeople />
          </div>
        </section>
      </motion.section>
    </div>
  );
};
