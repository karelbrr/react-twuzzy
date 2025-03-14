import { PermissionSettingsInProfileDetails } from "./../my-components/PermissionSettingsInProfileDetails";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Error as ErrorDiv } from "@/my-components/Error";
import { useQuery } from "@tanstack/react-query";
import { getProfileData } from "@/my-components/my-hooks/getProfileData";
import { User } from "src/my-components/types.tsx";
import { Helmet } from "react-helmet-async";

export const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const {
    data: profileDetails,
    error: errorQuery,
    isLoading,
  } = useQuery<User, Error>({
    queryKey: ["profileDetailsForProfileDetails", id],
    queryFn: () => getProfileData(id),
  });
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate().toString().padStart(2, "0");

    return `${month} ${day}, ${year}`;
  };

  return (
    <section>
      <Helmet>
        {isLoading ? (
          <title>profile details | Twüzzy</title>
        ) : (
          <title>
            {`${profileDetails?.first_name} ${profileDetails?.last_name}`} |
            Profile | Twüzzy
          </title>
        )}
      </Helmet>

      <div className="w-1/2 m-auto mt-10 flex items-baseline">
        <Button onClick={goBack} variant={"outline"} className="">
          <ArrowLeft />
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
        <div className="ml-7 opacity-90 ">
          {isLoading || errorQuery ? (
            <Skeleton className="w-[210px] h-7" />
          ) : (
            <div className="flex items-baseline space-x-5">
              <h2 className=" text-3xl font-semibold">
                {profileDetails?.first_name} {profileDetails?.last_name}
              </h2>
              <PermissionSettingsInProfileDetails />
            </div>
          )}
          {isLoading || errorQuery ? (
            <Skeleton className="w-[120px] h-4 mt-1" />
          ) : (
            <p className="opacity-60">@{profileDetails?.username}</p>
          )}
        </div>
      </div>
      <Separator className="w-1/2 m-auto mt-8" />
      {profileDetails?.is_private ? (
        <div className="flex justify-center mt-4 opacity-70">
          <h2 className="font-medium">This account is private</h2>
        </div>
      ) : (
        <div className="mt-8">
          <div className="w-1/2 m-auto min-h-[140px] max-h-[240px]">
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

            {errorQuery && <ErrorDiv error={errorQuery?.message} />}
          </div>
          <Separator className="w-1/2 m-auto my-7" />
          <div className="w-1/2 m-auto">
            <h3 className="text-2xl font-semibold">Badges</h3>
            <div className=" space-x-2 pt-2">
              {isLoading || errorQuery ? (
                <div className="flex space-x-2">
                  <Skeleton className="w-24 h-5" />
                  <Skeleton className="w-32 h-5" />
                  <Skeleton className="w-20 h-5" />
                </div>
              ) : (
                profileDetails?.badges.map((badge) => (
                  <Badge key={badge.id}>{badge.badges.name}</Badge>
                ))
              )}
            </div>
          </div>
          {profileDetails?.visible_join_date && (
            <div className="w-1/2 mt-2 m-auto min-h-[140px] max-h-[240px]">
              <h3 className="text-2xl font-semibold">Member From</h3>
              {isLoading ? (
                <Skeleton className="w-20 h-4 mt-1" />
              ) : (
                <p className="opacity-60 mt-1">
                  {formatDate(profileDetails?.created_at || "")}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
