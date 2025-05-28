import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, SubmitHandler } from "react-hook-form";
import { supabase } from "./my-hooks/createClient";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

type Inputs = {
  group_name: string;
  description: string;
  avatar_url: string;
  is_public: boolean;
};

export const CreateGroup = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const addGroup = async (data: Inputs) => {
    const { data: chat, error: chatError } = await supabase
      .from("groups")
      .insert([
        {
          created_by: user?.id,
          updated_at: new Date(),
          ...data,
        },
      ]);

    if (chatError) {
      console.error("Error creating chat:", chatError.message);
      throw new Error(chatError.message);
    }
    return { chat };
  };

  const { mutate } = useMutation({
    mutationFn: addGroup,
    onSuccess: () => {
      reset({group_name: "", description: "", is_public: false});
      toast({
        title: "Group Created",
        description: "Your group has been created successfully.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "There was an error creating the group.",
      });
    },
  });

  const handleFinish = async (formData: Inputs) => {
    try {
      let avatarUrl = "";
      if (file) {
        avatarUrl = await uploadGroupAvatar(file, formData.group_name);
      }

      mutate({
        ...formData,
        avatar_url: avatarUrl,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to upload group avatar.",
      });
    }
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      is_public: false,
    },
  });
  const onSubmit: SubmitHandler<Inputs> = (data) => handleFinish(data);

  // ZMĚNA: upravená upload funkce pro skupiny
  const uploadGroupAvatar = async (file: File, groupName: string) => {
    if (!file) throw new Error("No avatar file provided");

    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const safeName = groupName.replace(/\s+/g, "_").toLowerCase();
    const filePath = `groups/${safeName}-${timestamp}.${extension}`;

    const { data, error } = await supabase.storage
      .from("avatarsgroups")
      .upload(filePath, file);

    if (error) {
      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatarsgroups")
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to get public URL.");
    }

    return publicUrlData.publicUrl;
  };

  return (
    <section>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"outline"} className=" mr-2 w-full">
            <Users /> Create Group
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Group</DialogTitle>
            <DialogDescription>
              Start a conversation by creating a group and adding people.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="name">Group Name</Label>
              <Input
                type="text"
                id="name"
                placeholder={
                  errors.group_name ? "This field is required" : "Group Name"
                }
                {...register("group_name", { required: true })}
                className={`${
                  errors.group_name && "border-red-700 placeholder:text-red-700"
                }`}
              />
            </div>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="desc">Description</Label>
              <Input
                type="text"
                id="desc"
                placeholder={
                  errors.description ? "This field is required" : "Group Name"
                }
                {...register("description", { required: true })}
                className={`${
                  errors.description &&
                  "border-red-700 placeholder:text-red-700"
                }`}
              />
            </div>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="avatar">Avatar</Label>
              <Input
                type="file"
                id="avatar"
                accept=".png, .jpg, .jpeg"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="grid w-full max-w-full items-center gap-1.5">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                defaultValue="private"
                value={watch("is_public") ? "public" : "private"}
                onValueChange={(value) =>
                  setValue("is_public", value === "public")
                }
              >
                <SelectTrigger className="max-w-full">
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Options</SelectLabel>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Create</Button>
            </div>
            
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};
