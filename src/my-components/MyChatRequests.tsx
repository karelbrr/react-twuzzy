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

interface ChatMember {
  user_id: string;
}

interface ChatRequest {
  id: string;
  created_at: string;
  is_group: boolean;
  updated_at: string;
  is_started: boolean;
  created_by: string;
  chat_members: ChatMember[];
}

export function MyChatRequests({}) {
  const { user } = useAuth();
  const fetchUserData = async (): Promise<ChatRequest[]> => {
    const { data, error } = await supabase
      .from("chats")
      .select(`*,chat_members!inner(user_id)`)
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
          <div className="space-y-2">
            {data?.map((item) => (
              <div
                key={item.id}
                className="flex justify-between border p-2 rounded-lg"
              >
                <p className="text-sm">{item.created_by}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis size={17} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      <p>Jakub Slovák</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Accept Request</DropdownMenuItem>
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
