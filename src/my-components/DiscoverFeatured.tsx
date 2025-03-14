import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "./my-hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Error as ErrorDiv } from "./Error";
import { motion } from "framer-motion";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  username: string;
}

export const DiscoverFeatured = () => {
  const skeletonCount = 5;
  const skeletonArray = Array(skeletonCount).fill(null);
  const { user } = useAuth();
  const fetchUserData = async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, avatar, username")
      .neq("id", user?.id);

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

  return (
    <motion.section initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 0.3 } }}>
      <h2 className="font-bold text-2xl mx-10 mt-10 mb-5">Featured People</h2>
      <section className="grid grid-cols-5">
        {errorQuery && (
          <div className="ml-10">
            <ErrorDiv error={errorQuery?.message} />
          </div>
        )}

        {isLoading &&
          skeletonArray.map((_, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center mb-5 mt-5"
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
          <div key={user.id} className=" flex flex-col items-center mt-5 hover:opacity-60 transition">
            <Link to={`/profile/${user.id}`}>
              <Avatar className="size-36 ">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-4xl">
                  {user?.first_name?.substring(0, 1) || ""}
                  {user?.last_name?.substring(0, 1) || ""}
                </AvatarFallback>
              </Avatar>
            </Link>

            <Button
              asChild
              variant={"link"}
              className="text-center  mt-5 text-xl font-semibold"
            >
              <Link to={`/profile/${user.id}`}>
                {user.first_name} {user.last_name}
              </Link>
            </Button>

            <h3 className="text-sm opacity-65">@{user.username}</h3>
          </div>
        ))}
      </section>
      <h2 className="font-bold text-2xl mx-10 mt-10 mb-5">Featured Groups</h2>
    </motion.section>
  );
};
