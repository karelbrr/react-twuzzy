import { useAuth } from "@/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "./createClient";
import { useQuery } from "@tanstack/react-query";
import { User } from "./types";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Error as ErrorDiv } from "./Error";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

type Inputs = {
  first_name: string;
  last_name: string;
  username: string;
  desc: string;
};

export const SettingsProfile = () => {
  const { user } = useAuth();

  const fetchUserData = async (): Promise<User> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data: profileData,
    error: errorQuery,
    isLoading,
  } = useQuery<User, Error>({
    queryKey: ["profileDataForSettings"],
    queryFn: fetchUserData,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: profileData || {
      first_name: "",
      last_name: "",
      username: "",
      desc: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        username: profileData.username,
        desc: profileData.desc,
      });
    }
  }, [profileData, reset]);

  return (
    <motion.section
      className="ml-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
    >
      <h2 className="font-bold text-2xl mt-10 mb-5">Profile Settings</h2>

      {errorQuery && (
        <div className=" mb-5 w-1/2">
          <ErrorDiv error={errorQuery.message} />
        </div>
      )}
      <div className="flex justify-center w-full">
        <Card className=" w-1/2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Quickly and easily update your personal details
            </CardDescription>
          </CardHeader>
          <form
            className="space-y-5 "
            onSubmit={handleSubmit((data) => {
              console.log(data);
            })}
          >
            <CardContent className="pb-0">
              <div className="flex flex-col  gap-1.5">
                <Label htmlFor="first_name" className="text-md">
                  First Name
                </Label>
                <Input
                  id="first_name"
                  className={` ${
                    errors.first_name ? "border-red-500 " : "border-secondary"
                  }`}
                  {...register("first_name", {
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters long",
                    },
                    maxLength: {
                      value: 15,
                      message: "First name must be max 15 characters long",
                    },
                    validate: (value) =>
                      /^[A-Z][a-z]*$/.test(value) ||
                      "First name must start with a capital letter and contain only letters",
                  })}
                />
                {errors.first_name && (
                  <h2 className="text-red-500">{errors.first_name.message}</h2>
                )}
              </div>
              <div className="flex flex-col mt-5  gap-1.5 ">
                <Label htmlFor="last_name" className="text-md">
                  Last Name
                </Label>
                <Input
                  className={` ${
                    errors.last_name ? "border-red-500 " : "border-secondary"
                  }`}
                  id="last_name"
                  {...register("last_name", {
                    required: "Last name is required",
                    minLength: {
                      value: 3,
                      message: "Last name must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 20,
                      message: "Last name must be max 20 characters long",
                    },
                    validate: (value) => {
                      if (!/^[A-Z][a-z]*$/.test(value)) {
                        return "Last name must start with a capital letter and contain only letters";
                      }
                      if (/\s/.test(value)) {
                        return "Last name cannot contain spaces";
                      }
                      return true;
                    },
                  })}
                />
                {errors.last_name && (
                  <h2 className="text-red-500">{errors.last_name.message}</h2>
                )}
              </div>
              <div className="flex flex-col mt-5  gap-1.5 ">
                <Label htmlFor="username" className="text-md">
                  Username
                </Label>
                <Input
                  className={`${
                    errors.username ? "border-red-500 " : "border-secondary"
                  }`}
                  id="username"
                  {...register("username", {
                    required: "Last name is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters long",
                    },
                    maxLength: {
                      value: 15,
                      message: "Username must be max 20 characters long",
                    },
                    pattern: {
                      value: /^[a-z0-9_.]+$/,
                      message:
                        "Username can only contain lowercase letters, numbers, underscores, and dots",
                    },
                    validate: (value) =>
                      !/^\./.test(value) || "Username cannot start with a dot",
                  })}
                />
                {errors.username && (
                  <h2 className="text-red-500">{errors.username.message}</h2>
                )}
              </div>
              <div className="flex flex-col mt-5 gap-1.5 ">
                <Label htmlFor="desc" className="text-md">
                  Profile Description
                </Label>
                <Textarea
                  id="desc"
                  className={`min-h-[310px] text-justify ${
                    errors.desc ? "border-red-500 " : "border-secondary"
                  }`}
                  {...register("desc", {
                    required: "Description is required",
                    minLength: {
                      value: 5,
                      message: "Description must be at least 5 characters long",
                    },
                  })}
                />
                {errors.desc && (
                  <h2 className="text-red-500">{errors.desc.message}</h2>
                )}
              </div>
              
            </CardContent>
            <CardFooter>
              <Button className=" w-[20%] m-0" type="submit">
                Update
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="flex flex-col w-1/2">
          <Card className="h-[435px] ml-10">
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Quickly and easily update your privacy details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full flex flex-col  gap-1.5">
                <Label htmlFor="profile-visibility" className="text-md">
                  Profile Visibility
                </Label>
                <Select name="profile-visibility" defaultValue="public">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Public" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col mt-5  gap-1.5">
                <Label htmlFor="data-sharing" className="text-md">
                  Data Sharing Permission
                </Label>
                <Select name="data-sharing" defaultValue="allow">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Allow Data Sharing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow Data Sharing</SelectItem>
                    <SelectItem value="deny">Deny Data Sharing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col mt-5  gap-1.5">
                <Label htmlFor="activity-tracking" className="text-md">
                  Activity Tracking
                </Label>
                <Select name="activity-tracking" defaultValue="enabled">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Enabled" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className=" w-[20%] m-0" type="submit">
                Update
              </Button>
            </CardFooter>
          </Card>
          
        </div>
      </div>
    </motion.section>
  );
};
