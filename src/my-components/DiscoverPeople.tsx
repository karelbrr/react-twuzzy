import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { supabase } from "./my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";
import { Error as ErrorDiv } from "./Error";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string;
  username: string;
}

export const DiscoverPeople = () => {
  const { user } = useAuth();

  const fetchUsers = async (searchTerm: string): Promise<User[]> => {
    if (!searchTerm) return [];

    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, username, avatar")
      .ilike("username", `%${searchTerm}%`)
      .neq("id", user?.id);

    if (error) {
      throw new Error(error.message);
    }
    console.log(data);

    return data;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ searchTerm: string }>(); // Typ pro form data

  const searchTerm = watch("searchTerm"); // Sleduje hodnotu hledaného termínu

  const {
    data: users,
    isLoading,
    error: errorQuery,
  } = useQuery({
    queryKey: ["users", searchTerm],
    queryFn: () => fetchUsers(searchTerm),
    enabled: searchTerm?.trim() !== "", // Dotaz se spustí pouze pokud searchTerm není prázdný
  });

  const onSubmit = (data: { searchTerm: string }) => {
    // Tento handler je zavolán po odeslání formuláře
    console.log("Searching for:", data.searchTerm);
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
          {...register("searchTerm", {
            required: "Search term is required",
          })}
          placeholder="Search for people..."
          className="py-5"
        />
        {errors.searchTerm && (
          <span className="text-red-500">{errors.searchTerm.message}</span>
        )}
      </form>
      {errorQuery && (
        <div className="ml-10">
          <ErrorDiv error={errorQuery?.message} />
        </div>
      )}
      <div className="grid grid-cols-6 ">
        {users?.map((user) => (
          <div
            key={user.id}
            className=" flex flex-col  items-center px-10 mt-10"
          >
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
                {user?.first_name} {user?.last_name}
              </Link>
            </div>
            <h3 className="text-sm opacity-65">{user.username}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
