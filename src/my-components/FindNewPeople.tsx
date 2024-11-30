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

interface User {
  id: string;
  first_name: string;
  last_name: string;
}
interface Chat {
  id?: string;
  is_group: boolean;
  updated_at: string;
  created_by: string | undefined;
  is_started: boolean;
}

interface membersDataType {
  chat_id: string;
  user_id: string | undefined;
  added_at: string;
  role: string;
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
      is_group: false,
      updated_at: new Date().toISOString(),
      is_started: false,
      created_by: user?.id,
    };

    // Vložit nový chat do tabulky "chats"
    const { data: chat, error: chatError } = await supabase
      .from("chats")
      .insert([chatData])
      .select("id")
      .single();

    if (chatError) {
      console.error("Error creating chat:", chatError.message);
      throw new Error(chatError.message);
    }

    const chatId = chat?.id;
    if (!chatId) {
      throw new Error("Failed to retrieve chat ID");
    }
    const membersData: membersDataType[] = [
      {
        chat_id: chatId,
        user_id: user?.id,
        added_at: new Date().toISOString(),
        role: "member",
      },
      {
        chat_id: chatId,
        user_id: oppositeUserId,
        added_at: new Date().toISOString(),
        role: "member",
      },
    ];

    const { data: members, error: membersError } = await supabase
      .from("chat_members")
      .insert(membersData);

    if (membersError) {
      console.error("Error adding chat members:", membersError.message);
      throw new Error(membersError.message);
    }

    return { chat, members };
  };

  const { mutate, isPending, error } = useMutation({
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
    }
  });

  const handleFinish = (oppositeUserId: string) => {
    mutate(oppositeUserId);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-5 w-1/5 mr-4 " variant="outline">
          <SquarePen />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Discover new people to start chatting with.</DialogTitle>
          <DialogDescription>
            Discover and chat with new people around you to expand your network
            and start engaging conversations
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
                {errorQuery && (
                  <div className="border border-red-700 mt-2 p-3 text-red-700 rounded-lg">
                    <h4>Error</h4>
                    <p>{errorQuery.message}</p>
                  </div>
                )}
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

                          <DropdownMenuItem>View Profile</DropdownMenuItem>

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
