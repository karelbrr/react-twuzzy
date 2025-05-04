import { motion } from "framer-motion";

import { User } from "src/my-components/types.tsx";

import { useAuth } from "@/auth/AuthProvider";
import { getProfileData } from "./my-hooks/getProfileData";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "./my-hooks/createClient";
import { useToast } from "@/hooks/use-toast";
import { Error as ErrorDiv } from "./Error";
import { Helmet } from "react-helmet-async";

export const SettingsAvatar = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const {
    data,
    error: errorQuery,
    isLoading,
  } = useQuery<User, Error>({
    queryKey: ["profileDetailsUpperBar", user?.id],
    queryFn: () => getProfileData(user?.id),
  });

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) {
        throw new Error("User is not logged in.");
      }

      if (data?.avatar) {
        const oldFilePath = data.avatar.split("/").pop();

        if (oldFilePath) {
          await supabase.storage
            .from("pfps")
            .remove([`${user.id}/${oldFilePath}`]);
        }
      }

      // Nahrání nového souboru
      const filePath = `${user.id}/${file.name}`;
      const { data: uploadData, error } = await supabase.storage
        .from("pfps")
        .upload(filePath, file, { upsert: true });

      if (error) {
        throw new Error(error.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("pfps")
        .getPublicUrl(uploadData.path);
      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to retrieve public URL.");
      }

      // Aktualizace URL v databázi
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar: publicUrlData.publicUrl })
        .eq("id", user.id);

      if (updateError) {
        throw new Error("Failed to update avatar URL in the database.");
      }

      return publicUrlData.publicUrl;
    },
    onSuccess: () => {
      toast({ description: "Your avatar has been successfully updated!" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "There was an error while updating the avatar",
      });
    },
  });

  const handleSubmit = () => {
    if (!file) {
      toast({
        variant: "destructive",
        description: "No avatar selected!",
      });
      return;
    }

    uploadAvatar.mutate(file);
  };

  const resetAvatar = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error("User is not logged in.");
      }

      if (data?.avatar) {
        const oldFilePath = data.avatar.split("/").pop();
        if (oldFilePath) {
          await supabase.storage
            .from("pfps")
            .remove([`${user.id}/${oldFilePath}`]);
        }
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar: null })
        .eq("id", user.id);

      if (updateError) {
        throw new Error("Failed to update avatar URL in the database.");
      }

      return;
    },
    onSuccess: () => {
      toast({ description: "Your avatar has been successfully reseted!" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "There was an error while updating the avatar",
      });
    },
  });

  const resetSubmit = () => {
    resetAvatar.mutate();
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
      className="ml-10"
    >
      <Helmet>
        <title>Settings Avatar | Twüzzy</title>
      </Helmet>
      <h2 className="font-bold text-2xl  mb-5 mt-10 ">Avatar customization</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card className="">
          <CardHeader>
            <CardTitle>Your Current Avatar</CardTitle>
            <CardDescription>
              This is the avatar currently displayed on your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center mb-4">
            {isLoading ? (
              <Skeleton className="size-[320px] mt-4 rounded-full" />
            ) : errorQuery ? (
              <ErrorDiv error={errorQuery.message} />
            ) : (
              <Avatar className="size-[320px] mt-4">
                <AvatarFallback>
                  {data?.first_name?.substring(0, 1) || ""}
                  {data?.last_name?.substring(0, 1) || ""}
                </AvatarFallback>
                <AvatarImage
                  src={data?.avatar}
                  className="object-cover w-full h-full"
                />
              </Avatar>
            )}
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"outline"} disabled={!data?.avatar}>
                  Reset Avatar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Avatar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reset your avatar? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetSubmit}>
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
        <Card className="">
          <CardHeader>
            <CardTitle>Update Avatar</CardTitle>
            <CardDescription>
              Choose and crop a new image to update your avatar
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center mb-4">
            {file ? (
              <Avatar className="size-[320px] mt-4">
                <AvatarFallback></AvatarFallback>
                <AvatarImage
                  className="object-cover w-full h-full"
                  src={URL.createObjectURL(file)}
                />
              </Avatar>
            ) : (
              <div className="flex items-center justify-center  mt-4">
                <label
                  htmlFor="avatar"
                  className=" rounded-full font-medium size-[320px] cursor-pointer flex items-center text-muted-foreground text-sm justify-center borde cursor-pointe bg-muted text-center"
                >
                  Choose an avatar from files or drop one
                  <Input
                    id="avatar"
                    className="hidden"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            )}
          </CardContent>
          <CardFooter className="space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant={"outline"} disabled={!file}>
                  Upload Avatar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Upload Avatar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to upload this avatar? This action
                    will replace your current avatar.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>
                    Upload
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {file && (
              <Button variant={"outline"} onClick={() => setFile(null)}>
                Reset Chosen Avatar
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </motion.section>
  );
};
