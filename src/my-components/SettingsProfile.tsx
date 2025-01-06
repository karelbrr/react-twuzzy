import { useAuth } from "@/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "./createClient";
import { useQuery } from "@tanstack/react-query";
import { User } from "./types";

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


  return (
    <section className="">
      <h2 className="font-bold text-3xl m-10">Profile Settings</h2>
      <form className="space-y-5">
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name"  value={data?.first_name}/>
        </div>
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name"  value={data?.last_name}/>
        </div>
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="username">Username</Label>
          <Input id="username"  value={data?.username}/>
        </div>
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="desc">Profile Description</Label>
          <Textarea id="desc"  className="min-h-[300px] text-justify" value={data?.desc}/>
        </div>
  
      </form>
    </section>
  );
};
