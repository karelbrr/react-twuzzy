import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SquarePen } from "lucide-react";
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
import { supabase } from "./createClient";
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

interface User {
  id: string;
  first_name: string;
  last_name: string;
}

export const SideBar = () => {
  const { user } = useAuth();
  const fetchUserData = async (): Promise<User[]> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .neq("id", user?.id);
    if (error) throw new Error(error.message);
    return data;
  };

  const { data, error: errorQuery } = useQuery<User[], Error>({
    queryKey: ["findNewUsers"],
    queryFn: fetchUserData,
  });

  return (
    <section className="h-screen w-[18%]  fixed border-r">
      <div className="flex justify-between">
        <h3 className=" font-bold text-2xl m-auto w-4/5  mt-5 ml-5">Chats</h3>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-5 w-1/5 mr-4 " variant="outline">
              <SquarePen />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Discover new people to start chatting with.
              </DialogTitle>
              <DialogDescription>
                Discover and chat with new people around you to expand your
                network and start engaging conversations
              </DialogDescription>
            </DialogHeader>
            <div>
              <Command>
                <CommandInput placeholder="Search for people to chat with..." />
                <CommandList>
                  <CommandEmpty>
                    No people found. Please try again.
                  </CommandEmpty>
                  <CommandGroup className="mt-1">
                    {data?.map((item) => (
                      <CommandItem
                        className="cursor-pointer"
                        key={item.id}
                        asChild
                      >
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
                              <DropdownMenuItem>View Profile</DropdownMenuItem>
                              <DropdownMenuItem>Send Request</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-700 focus:text-red-700">
                                Block
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
      </div>

      <div className="m-auto w-[90%] mt-4 ">
        <Button
          variant="outline"
          className=" w-full flex justify-start h-14 mb-3"
        >
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
          Jan Novák
        </Button>
        <Button
          variant="outline"
          className=" w-full flex justify-start h-14 mb-3"
        >
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          Jan Novák
        </Button>
      </div>
    </section>
  );
};
