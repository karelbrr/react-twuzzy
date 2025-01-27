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

type Inputs = {
  is_private: boolean;
  activity_tracking: boolean;
  data_sharing: boolean;
};

interface PrivacySettingsProps {
  is_private?: boolean;
  activity_tracking?: boolean;
  data_sharing?: boolean;
}

export function PrivacySettings({
  is_private = false,
  activity_tracking = false,
  data_sharing = false,
}: PrivacySettingsProps) {
  const { handleSubmit, reset, watch, setValue } = useForm<Inputs>({
    defaultValues: {
      is_private,
      activity_tracking,
      data_sharing,
    },
  });
  useEffect(() => {
    reset({
      is_private,
      activity_tracking,
      data_sharing,
    });
  }, [is_private, activity_tracking, data_sharing, reset]);

  const onSubmit = (data: Inputs) => {
    console.log(data);
  };

  return (
    <Card className="h-[435px] ml-10">
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
          <AlertDialogSection
            onConfirm={handleSubmit(onSubmit)}
            title={"Are you sure you want to privacy setting in your profile?"}
            desc={
              "This action will save the changes to your profile, and it cannotbe undone."
            }
          />
        </form>
      </CardContent>
    </Card>
  );
}
