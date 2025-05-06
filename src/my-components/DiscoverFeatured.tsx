import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "./my-hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Error as ErrorDiv } from "./Error";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  username: string;
}

interface Group {
  id: string;
  created_at: string;
  updated_at: string;
  group_name: string;
  created_by: string;
  is_public: string;
  avatar_url: string;
  description: string;
}

export const DiscoverFeatured = () => {
  const skeletonCount = 6;
  const skeletonArray = Array(skeletonCount).fill(null);
  const { user } = useAuth();

  const fetchUserData = async (): Promise<User[]> => {
    const { data: blocked, error: blockedError } = await supabase
      .from("blocked_users")
      .select("blocked_id")
      .eq("blocker_id", user?.id);

    if (blockedError) throw new Error(blockedError.message);

    const blockedIds = blocked?.map((entry) => entry.blocked_id) || [];

    const excludedIds = [user?.id, ...blockedIds].filter(Boolean);

    // Vytvoř správný řetězec pro .not("id", "in", ...)
    const excludedIdsString = `(${excludedIds.join(",")})`;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar, username")
      .not("id", "in", excludedIdsString);

    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data,
    error: errorQuery,
    isLoading,
  } = useQuery<User[], Error>({
    queryKey: ["discoverNewUsers"],
    queryFn: fetchUserData,
  });

  const fetchGroupsData = async (): Promise<Group[]> => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("is_public", true)
      .neq("created_by", user?.id);

    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data: groupsData,
    error: errorGroupsQuery,
    isLoading: isLoadingGroups,
  } = useQuery<Group[], Error>({
    queryKey: ["discoverNewGroups"],
    queryFn: fetchGroupsData,
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
    >
      <h2 className="font-bold text-2xl mx-10 mt-10 mb-1">Featured People</h2>
      <p className="mx-10 mb-5 text-muted-foreground">
        Connect with popular and recommended users!
      </p>
      <section className="flex overflow-auto ml-5 min-h-[250px]">
        {errorQuery && (
          <div className="ml-10">
            <ErrorDiv error={errorQuery?.message} />
          </div>
        )}

        {isLoading &&
          skeletonArray.map((_, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center mb-5 px-10 "
            >
              <Skeleton className="size-36 rounded-full mt-7 " />

              <div className="flex mb-3 mt-5 space-x-2">
                <Skeleton className="h-5 w-12" />{" "}
                <Skeleton className="h-5 w-20" />{" "}
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          ))}

        {data?.map((user) => (
          <div key={user.id} className=" flex flex-col items-center px-10 mt-5">
            <div className=" hover:opacity-60 transition flex flex-col items-center">
              <Link to={`/profile/${user.id}`}>
                <Avatar className="size-36 ">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-4xl">
                    {user?.first_name?.substring(0, 1) || ""}
                    {user?.last_name?.substring(0, 1) || ""}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <Link className="mt-3 font-semibold" to={`/profile/${user.id}`}>
                {user.first_name} {user.last_name}
              </Link>
            </div>

            <h3 className="text-sm opacity-65">@{user.username}</h3>
          </div>
        ))}
      </section>
      <h2 className="font-bold text-2xl mx-10 mt-10 mb-1">Featured Groups</h2>
      <p className="mx-10 mb-5 text-muted-foreground">
        Join trending and recommended communities!
      </p>

      <section className="flex overflow-auto ml-5 min-h-[250px]">
        {errorQuery && (
          <div className="ml-10">
            <ErrorDiv error={errorGroupsQuery?.message} />
          </div>
        )}

        {isLoadingGroups &&
          skeletonArray.map((_, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center mb-5 px-10 "
            >
              <Skeleton className="size-36 rounded-full mt-7 " />

              <div className="flex mb-3 mt-5 space-x-2">
                <Skeleton className="h-5 w-12" />{" "}
                <Skeleton className="h-5 w-20" />{" "}
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          ))}

        {groupsData?.map((group) => (
          <div
            key={group.id}
            className=" flex flex-col items-center px-10 mt-5"
          >
            <div className="flex flex-col items-center">
              <Avatar className="size-36 ">
                <AvatarImage src={group.avatar_url} />
                <AvatarFallback className="text-4xl">
                  {group.group_name.slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <p className="mt-3 font-semibold">{group.group_name}</p>
            </div>

            <h3 className="text-sm opacity-65">{group.description}</h3>
            <Button className="text-xs mt-3 px-2 " variant={"outline"}>
              Join Group
            </Button>
          </div>
        ))}
      </section>
    </motion.section>
  );
};
