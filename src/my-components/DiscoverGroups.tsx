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

interface Group {
  id: string;
  group_name: string;
  description: string;
  avatar_url: string;
  is_public: boolean;
}

export const DiscoverGroups = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const fetchGroups = async (): Promise<Group[]> => {
    if (!searchTerm || !user?.id) return [];

    // Veřejné skupiny odpovídající názvu
    const { data: nameMatchedGroups, error: error1 } = await supabase
      .from("groups")
      .select("*")
      .ilike("group_name", `%${searchTerm}%`)
      .eq("is_public", true);

    if (error1) throw new Error(error1.message);

    // Veřejné skupiny, které vytvořil uživatel a odpovídají hledání
    const { data: createdGroups, error: error2 } = await supabase
      .from("groups")
      .select("*")
      .eq("created_by", user.id)
      .eq("is_public", true)
      .ilike("group_name", `%${searchTerm}%`);

    if (error2) throw new Error(error2.message);

    // Veřejné skupiny, kde je uživatel členem
    const { data: memberGroups, error: error3 } = await supabase
      .from("group_members")
      .select("group_id, groups(*)")
      .eq("user_id", user.id);

    if (error3) throw new Error(error3.message);

    const joinedGroups = memberGroups
      ?.map((item) => item.groups)
      .filter(
        (group) =>
          group?.is_public === true &&
          group?.group_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Sloučení všech skupin a odstranění duplicit
    const allGroups = [
      ...(nameMatchedGroups || []),
      ...(createdGroups || []),
      ...(joinedGroups || []),
    ];

    const uniqueGroups = allGroups.filter(
      (group, index, self) => index === self.findIndex((g) => g.id === group.id)
    );

    return uniqueGroups;
  };

  const { register, handleSubmit } = useForm<{ searchTerm: string }>();

  const {
    data: groups,
    isLoading,
    error: errorQuery,
  } = useQuery<Group[]>({
    queryKey: ["groups", searchTerm],
    queryFn: fetchGroups,
    enabled: !!searchTerm,
  });

  const onSubmit = (data: { searchTerm: string }) => {
    setSearchTerm(data.searchTerm);
  };

  return (
    <section>
      <h2 className="font-bold text-2xl mx-10 mt-10 mb-1">Groups</h2>
      <p className="mx-10 mb-5 text-muted-foreground">
        Explore and join groups that match your interests and passions!
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
      ) : groups && groups.length > 0 ? (
        <div>
          <div className="grid grid-cols-6 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex flex-col items-center px-10 mt-10"
              >
                <div className="hover:opacity-60 transition flex flex-col items-center">
                  <Link to={`/profile/${group.id}`}>
                    <Avatar className="size-36">
                      <AvatarImage src={group.avatar_url} />
                      <AvatarFallback className="text-4xl">
                        {group.group_name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link
                    className="mt-3 font-semibold"
                    to={`/profile/${group.id}`}
                  >
                    {group.group_name}
                  </Link>
                </div>
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
