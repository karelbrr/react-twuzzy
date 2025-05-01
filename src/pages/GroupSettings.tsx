import { useAuth } from "@/auth/AuthProvider";
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
import { Navigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import AlertDialogSection from "@/my-components/AlertDialogSection";
import { toast } from "@/hooks/use-toast";
import { Error as ErrorDiv } from "@/my-components/Error";

interface GroupMembers {
  id: string;
  created_at: string;
  is_joined: boolean;
  is_verified: boolean;
  group_id: string;
  user_id: string;
  profiles: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

interface GroupData {
  id: string;
  created_at: string;
  updated_at: string;
  group_name: string;
  created_by: string;
  is_public: boolean;
  description: string;
  avatar_url: string;
}

interface Inputs {
  group_name: string;
  description: string;
  is_public: boolean;
}

export const GroupSettings = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const fetchGroupData = async (): Promise<GroupData> => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
  const {
    data: groupData,
    error: errorQuery,
    isLoading: groupIsLoading,
  } = useQuery<GroupData>({
    queryKey: ["fetchGroupData", id],
    queryFn: fetchGroupData,
    enabled: !!user,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: groupData || {
      group_name: "",
      description: "",
      is_public: false,
    },
  });

  useEffect(() => {
    if (groupData) {
      reset({
        group_name: groupData?.group_name,
        description: groupData?.description,
        is_public: groupData?.is_public,
      });
    }
  }, [groupData, reset]);

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

  const onSubmit = (data: Inputs) => {
    if (
      data.group_name === groupData?.group_name &&
      data.description === groupData?.description &&
      data.is_public === groupData?.is_public
    ) {
      toast({
        description: "You need to make changes before updating your data!",
      });
      return;
    } else {
      console.log("data", data);
    }
  };

  if (!user || groupIsLoading) {
    return <div>Loading...</div>;
  }

  if (groupData?.created_by !== user.id) {
    return <Navigate to="/" replace />;
  }

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
        <section>
          <form className="space-y-5 mb-5">
            <div className="flex flex-col gap-1.5 w-1/2 ">
              <Label htmlFor="first_name" className="text-md">
                Group Name
              </Label>
              <Input
                className=""
                placeholder="Group Name"
                {...register("group_name", {
                  required: "First name is required",
                })}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-1/2">
              <Label htmlFor="first_name" className="text-md">
                Group Description
              </Label>
              <Input
                className=""
                placeholder="Short Group Description"
                {...register("description", {
                  required: "First name is required",
                })}
              />
            </div>
            <div className="flex flex-col gap-1.5 w-1/2">
              <Label className="text-md">Group Visibility</Label>
              <Select value={groupData?.is_public ? "public" : "private"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Public" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-1/2">
              <AlertDialogSection
                title={"Are you sure you want to update your profile?"}
                desc={
                  "This action will save the changes to your profile, and it cannot be undone."
                }
                onConfirm={handleSubmit(onSubmit)}
                isPending={false}
              />
            </div>
          </form>
          <div>
            <Label className="text-md">Users</Label>
            {error && <ErrorDiv error={error.message} />}
            <div className="space-y-2 my-2">
              {groupMembers?.map((item) => (
                <GroupSettingsUser
                  key={item.id}
                  id={item.id}
                  user_id={item.profiles.id}
                  first_name={item.profiles.first_name}
                  last_name={item.profiles.last_name}
                  is_verified={item.is_verified}
                  is_joined={item.is_joined}
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
