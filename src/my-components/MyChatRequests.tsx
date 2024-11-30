import { Ellipsis, MailQuestion } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "./createClient";
import { useAuth } from "@/auth/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMember {
  user_id: string;
}

interface Profiles {
  first_name: string
  last_name: string
}

interface ChatRequest {
  id: string;
  created_at: string;
  is_group: boolean;
  updated_at: string;
  is_started: boolean;
  created_by: string;
  chat_members: ChatMember[];
  profiles: Profiles;
}

export function MyChatRequests({}) {
  const { user } = useAuth();
  const fetchUserData = async (): Promise<ChatRequest[]> => {
    const { data, error } = await supabase
      .from("chats")
      .select(`*,chat_members!inner(user_id),profiles!inner(first_name, last_name)`)
      .eq("is_started", false)
      .eq("chat_members.user_id", user?.id)
      .neq("created_by", user?.id);
    if (error) throw new Error(error.message);
    return data;
  };
  const {
    data,
    error: errorQuery,
    isLoading,
  } = useQuery<ChatRequest[], Error>({
    queryKey: ["myChatData"],
    queryFn: fetchUserData,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="">
          <MailQuestion />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat requests</DialogTitle>
          <DialogDescription>
            Manage your chat requests with accept, decline, or view details of
            users who want to connect with you.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[200px] w-full">
          {errorQuery && (
            <div className="border border-red-700 mt-2 p-3 text-red-700 rounded-lg">
              <h4>Error</h4>
              <p>{errorQuery.message}</p>
            </div>
          )}

          {isLoading && <Skeleton className="w-full h-6" />}
          <div className="space-y-2">
            {data?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border p-2 rounded-lg"
              >
                <p className="text-sm">{item.profiles.first_name} {item.profiles.last_name}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis size={17} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      <p>{item.profiles.first_name} {item.profiles.last_name}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Accept Request</DropdownMenuItem>
                    <DropdownMenuItem>Decline Request</DropdownMenuItem>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-700 focus:text-red-700">
                      Block
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
