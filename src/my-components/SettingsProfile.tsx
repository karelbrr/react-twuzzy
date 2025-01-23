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
    data,
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
    defaultValues: data || {
      first_name: "",
      last_name: "",
      username: "",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        desc: data.desc,
      });
    }
  }, [data, reset]);

  return (
    <section className="">
      <h2 className="font-bold text-3xl m-10">Profile Settings</h2>
      {errorQuery && (
        <div className="ml-10 mb-5 w-1/2">
          <ErrorDiv error={errorQuery.message} />
        </div>
      )}
      <form
        className="space-y-5"
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            className={`${
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
              validate: value =>
      /^[A-Z][a-z]*$/.test(value) || "First name must start with a capital letter and contain only letters",
            })}
          />
          {errors.first_name && (
            <h2 className="text-red-500">{errors.first_name.message}</h2>
          )}
        </div>
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            className={`${
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
              validate: value => {
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
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="username">Username</Label>
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
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="desc">Profile Description</Label>
          <Textarea
            id="desc"
            className={`min-h-[300px] text-justify ${
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
        <Button className="ml-10" type="submit">
          submit
        </Button>
      </form>
    </section>
  );
};
