import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { supabase } from "./my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";
import { Error as ErrorDiv } from "./Error";
import { Button } from "@/components/ui/button"; // Přidání tlačítka
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  username: string;
}

export const DiscoverPeople = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string | null>(null); // Použijeme useState

  const fetchUsers = async (): Promise<User[]> => {
    if (!searchTerm) return [];

    // Získat seznam ID zablokovaných uživatelů
    const { data: blocked, error: blockedError } = await supabase
      .from("blocked_users")
      .select("blocked_id")
      .eq("blocker_id", user?.id);

    if (blockedError) throw new Error(blockedError.message);

    const blockedIds = blocked?.map((entry) => entry.blocked_id) || [];

    const excludedIds = [user?.id, ...blockedIds].filter(Boolean);
    const excludedIdsString = `(${excludedIds.join(",")})`;

    // Hlavní dotaz na profily s vyhledáváním a filtrováním
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, username, avatar")
      .or(
        `username.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`
      )
      .not("id", "in", excludedIdsString);

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const { register, handleSubmit } = useForm<{ searchTerm: string }>();

  const {
    data: users,
    isLoading,
    error: errorQuery,
  } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: fetchUsers,
    enabled: !!searchTerm,
  });

  const onSubmit = (data: { searchTerm: string }) => {
    setSearchTerm(data.searchTerm);
  };

  return (
    <section>
      <h2 className="font-bold text-2xl mx-10 mt-10 mb-1">People</h2>
      <p className="mx-10 mb-5 text-muted-foreground">
        Discover and connect with new and interesting people!
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-10 flex mt-2 space-x-2"
      >
        <Input
          {...register("searchTerm", { required: "Search term is required" })}
          placeholder="Search for people..."
          className="py-5"
        />
        <Button type="submit" variant={"outline"}>
          Search
        </Button>
      </form>
      {errorQuery && (
        <div className="ml-10">
          <ErrorDiv error={errorQuery?.message} />
        </div>
      )}
      {isLoading ? (
        // Skeleton loader - zobrazí se během načítání
        <div className="grid grid-cols-6 gap-4 ">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center px-10 mt-10 animate-pulse"
            >
              <Skeleton className="w-36 h-36 rounded-full" />
              <Skeleton className="w-24 h-5 rounded mt-3" />
              <Skeleton className="w-16 h-4 rounded mt-2" />
            </div>
          ))}
        </div>
      ) : users && users.length > 0 ? (
        <div>
          <div className="grid grid-cols-6 gap-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col items-center px-10 mt-10"
              >
                <div className="hover:opacity-60 transition flex flex-col items-center">
                  <Link to={`/profile/${user.id}`}>
                    <Avatar className="size-36">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-4xl">
                        {user.first_name?.charAt(0) || ""}
                        {user.last_name?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link
                    className="mt-3 font-semibold"
                    to={`/profile/${user.id}`}
                  >
                    {user.first_name} {user.last_name}
                  </Link>
                </div>
                <h3 className="text-sm opacity-65">{user.username}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : searchTerm ? (
        // Pokud je searchTerm vyplněný, ale žádné výsledky
        <div className="w-2/4 mt-5 mx-auto text-center">
          <h2 className="text-xl font-semibold">No Results</h2>
          <p className="text-muted-foreground">
            Your search doesn’t match any name or username.
          </p>
        </div>
      ) : (
        // Úvodní obrazovka před hledáním
        <div className="w-2/4 mt-5 mx-auto text-center">
          <h2 className="text-xl font-semibold">Start Searching</h2>
          <p className="text-muted-foreground">
            Find and connect with people by searching their name or username.
          </p>
        </div>
      )}
    </section>
  );
};
