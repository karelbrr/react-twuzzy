import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/my-components/createClient";
import { useQuery } from "@tanstack/react-query";
import { User } from "src/my-components/types.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import { Error as ErrorDiv } from "@/my-components/Error";

export const ProfileDetails = () => {
  const { id } = useParams();

  const fetchProfileDetails = async (): Promise<User> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const {
    data: profileDetails,
    error: errorQuery,
    isLoading,
  } = useQuery<User, Error>({
    queryKey: ["profileDetails"],
    queryFn: fetchProfileDetails,
  });

  return (
    <section>
      <div className="w-1/2 m-auto mt-10 flex items-baseline">
        <Button variant={"outline"} asChild>
          <Link to={"/"}>
            <ArrowLeft />
          </Link>
        </Button>
        <h2 className=" text-2xl font-semibold ml-4 opacity-95">
          Profile Details
        </h2>
      </div>

      <div className="flex w-1/2   m-auto mt-10 items-center">
        <div>
          {isLoading ? (
            <Skeleton className="size-36 rounded-full" />
          ) : (
            <Avatar className="size-36 ">
              <AvatarImage src={profileDetails?.avatar} />
              <AvatarFallback className="text-4xl">
                {profileDetails?.first_name?.substring(0, 1) || ""}
                {profileDetails?.last_name?.substring(0, 1) || ""}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="ml-7 opacity-90">
          {isLoading || errorQuery ? (
            <Skeleton className="w-[210px] h-7" />
          ) : (
            <h2 className=" text-3xl font-semibold">
              {profileDetails?.first_name} {profileDetails?.last_name}
            </h2>
          )}
          {isLoading || errorQuery ? (
            <Skeleton className="w-[120px] h-4 mt-1" />
          ) : (
            <p className="opacity-60">@{profileDetails?.username}</p>
          )}
        </div>
      </div>
      <Separator className="w-1/2 m-auto my-8" />
      <div className="w-1/2 m-auto">
        <h3 className="text-2xl font-semibold">Description</h3>
        {isLoading ? (
          <div>
            <Skeleton className="w-full h-4 mt-2" />
            <Skeleton className="w-full h-4 mt-2" />
            <Skeleton className="w-full h-4 mt-2" />
            <Skeleton className="w-3/4 h-4 mt-2" />
          </div>
        ) : (
          <p className=" text-justify opacity-70">{profileDetails?.desc}</p>
        )}

        {errorQuery && <ErrorDiv error={errorQuery?.message}/>}
      
      </div>
      <Separator className="w-1/2 m-auto my-7" />
      <div className="w-1/2 m-auto">
        <h3 className="text-2xl font-semibold">Badges</h3>
        <div className=" space-x-2 "></div>
      </div>
    </section>
  );
};
