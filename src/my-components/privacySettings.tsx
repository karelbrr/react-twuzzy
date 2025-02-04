import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import AlertDialogSection from "./AlertDialogSection";
import { ManageProfileVisibility } from "./ManageProfileVisibility";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { supabase } from "./my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";

type Inputs = {
  is_private: boolean;
  activity_tracking: boolean;
  data_sharing: boolean;
  visible_join_date: boolean;
};

interface PrivacySettingsProps {
  is_private?: boolean;
  activity_tracking?: boolean;
  data_sharing?: boolean;
  visible_join_date?: boolean;
}

export function PrivacySettings({
  is_private = false,
  activity_tracking = false,
  data_sharing = false,
  visible_join_date = false,
}: PrivacySettingsProps) {
  const { user } = useAuth();
  const { handleSubmit, reset, watch, setValue } = useForm<Inputs>({
    defaultValues: {
      is_private,
      activity_tracking,
      data_sharing,
      visible_join_date,
    },
  });
  useEffect(() => {
    reset({
      is_private,
      activity_tracking,
      data_sharing,
      visible_join_date,
    });
  }, [is_private, activity_tracking, data_sharing, visible_join_date, reset]);

  const updateProfile = async (variables: {
    userId: string | undefined;
    updatedData: Inputs;
  }) => {
    const { userId, updatedData } = variables;
    const { data, error } = await supabase
      .from("profiles")
      .update(updatedData)
      .eq("id", userId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your privacy settings has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "There was an error while updating privacy settings.",
      });
    },
  });

  const onSubmit = (data: Inputs) => {
    if (
      data.activity_tracking === activity_tracking &&
      data.data_sharing === data_sharing &&
      data.is_private === is_private &&
      data.visible_join_date === visible_join_date
    ) {
      toast({
        description: "You need to make changes before updating your data!",
      });
      return;
    } else {
      mutate({ userId: user?.id, updatedData: data });
    }
  };

  return (
    <Card className="ml-10">
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Quickly and easily update your privacy details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="w-full flex flex-col gap-1.5">
            <Label className="text-md">Profile Visibility</Label>
            <Select
              value={watch("is_private") ? "private" : "public"}
              onValueChange={(value) =>
                setValue("is_private", value === "private")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Public" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {watch("is_private") === true && (
            <div className="mt-2 mb-5">
              <ManageProfileVisibility />
            </div>
          )}

          <div className="flex flex-col mt-5 gap-1.5">
            <Label className="text-md">Data Sharing Permission</Label>
            <Select
              value={watch("data_sharing") ? "allow" : "deny"}
              onValueChange={(value) =>
                setValue("data_sharing", value === "allow")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Allow Data Sharing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allow">Allow Data Sharing</SelectItem>
                <SelectItem value="deny">Deny Data Sharing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col mt-5 mb-5 gap-1.5">
            <Label className="text-md">Activity Tracking</Label>
            <Select
              value={watch("activity_tracking") ? "enabled" : "disabled"}
              onValueChange={(value) =>
                setValue("activity_tracking", value === "enabled")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Enabled" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col mt-5 mb-5 gap-1.5">
            <Label className="text-md">Visible Date of Join on Profile</Label>
            <Select
              value={watch("visible_join_date") ? "visible" : "hidden"}
              onValueChange={(value) =>
                setValue("visible_join_date", value === "visible")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Visible" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogSection
            onConfirm={handleSubmit(onSubmit)}
            title={"Are you sure you want to privacy setting in your profile?"}
            desc={
              "This action will save the changes to your profile, and it cannot be undone."
            }
            isPending={isPending}
          />
        </form>
      </CardContent>
    </Card>
  );
}
