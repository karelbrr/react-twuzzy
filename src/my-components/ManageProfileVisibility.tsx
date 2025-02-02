import { Error as ErrorDiv } from "./Error";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "./my-hooks/createClient";
import { useAuth } from "@/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
interface User {
  id: string;
  first_name: string;
  last_name: string;
}

export const ManageProfileVisibility = () => {
  const { user } = useAuth();
  const fetchUserData = async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .neq("id", user?.id);

    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data,
    error: errorQuery,
    isLoading,
  } = useQuery<User[], Error>({
    queryKey: ["fetchUsersForProfileVisibility"],
    queryFn: fetchUserData,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Manage profile visibility</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Profile Visibility</DialogTitle>
          <DialogDescription>
            Control who can and cannot see your profile to maintain your privacy
            and visibility preferences.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Command>
            <CommandInput placeholder="Search for people who can see your profile" />
            <CommandList>
              {!errorQuery && !isLoading && (
                <CommandEmpty>No people found. Please try again.</CommandEmpty>
              )}
              <CommandGroup className="mt-1">
                {errorQuery && <ErrorDiv error={errorQuery?.message} />}
                {isLoading && <Skeleton className="w-full h-6" />}
                {data?.map((item) => (
                  <CommandItem key={item.id} asChild>
                    <div className="flex justify-between">
                      <p>
                        {item.first_name} {item.last_name}
                      </p>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Ellipsis />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>
                            <p>
                              {item.first_name} {item.last_name}
                            </p>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem>
                            Allow to see profile
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link to={`/profile/${item.id}`}>Profile</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
};
