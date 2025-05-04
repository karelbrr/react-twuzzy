import { Error as ErrorDiv } from "./Error";
import { Send, User } from "lucide-react";
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
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

interface User {
  id: string;
  first_name: string;
  last_name: string;
}
interface GroupRequest {
  joined_at: string;
  is_joined: boolean;
  user_id: string | undefined;
  group_id: string | undefined;
}

export function FindNewPeople() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { id } = useParams();
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
    queryKey: ["findNewUsersForGroup"],
    queryFn: fetchUserData,
  });

  const CreateGroupRequest = async (targetUserId: string) => {
    const chatData: GroupRequest = {
      joined_at: new Date().toISOString(),
      is_joined: false,
      user_id: targetUserId,
      group_id: id,
    };

    const { data: chat, error: chatError } = await supabase
      .from("group_members")
      .insert([chatData])
      .select("id")
      .single();

    if (chatError) {
      throw new Error(chatError.message);
    }

    return { chat };
  };

  const { mutate, isPending } = useMutation({
    mutationFn: CreateGroupRequest,
    onSuccess: () => {
      toast({
        title: "Request sent",
        description: "Your group request has been successfully sent.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "There was an error while sending request.",
      });
    },
  });

  const handleFinish = (targetUserId: string) => {
    mutate(targetUserId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" w-1/2 " variant="outline">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discover people to add to your group</DialogTitle>
          <DialogDescription>
            Find and invite new members to your group to collaborate, share
            ideas, and stay connected.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Command>
            <CommandInput placeholder="Search for people to chat with..." />
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
                          {isPending ? (
                            <DropdownMenuItem>
                              <Loader2 className="animate-spin" />
                              Please wait
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleFinish(item.id)}
                            >
                              <Send  />
                              Send Request
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem asChild>
                            <Link to={`/profile/${item.id}`}>
                              <User />
                              Profile
                            </Link>
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
}
