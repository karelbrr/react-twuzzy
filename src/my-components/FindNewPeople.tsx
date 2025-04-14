import { Error as ErrorDiv } from "./Error";
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
import { Link } from "react-router-dom";

interface User {
  id: string;
  first_name: string;
  last_name: string;
}
interface Chat {
  id?: string;
  updated_at: string;
  created_by: string | undefined;
  chat_with: string;
  is_started: boolean;
}

export function FindNewPeople() {
  const { toast } = useToast();
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
    queryKey: ["findNewUsers"],
    queryFn: fetchUserData,
  });

  const CreateChatRequest = async (oppositeUserId: string) => {
    const chatData: Chat = {
      updated_at: new Date().toISOString(),
      is_started: false,
      created_by: user?.id,
      chat_with: oppositeUserId,
    };

    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert([chatData])
      .select("id")
      .single();

    if (chatError) {
      console.error("Error creating chat:", chatError.message);
      throw new Error(chatError.message);
    }
    return { chat };
  };

  const { mutate, isPending } = useMutation({
    mutationFn: CreateChatRequest,
    onSuccess: () => {
      toast({
        title: "Request sent",
        description: "Your chat request has been successfully sent.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        description: "There was an error while sending request.",
      });
    },
  });

  const handleFinish = (oppositeUserId: string) => {
    mutate(oppositeUserId);
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
                              Send Request
                            </DropdownMenuItem>
                          )}

                          <DropdownMenuItem asChild>
                            <Link to={`/profile/${item.id}`}>Profile</Link>
                          </DropdownMenuItem>

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
  );
}
