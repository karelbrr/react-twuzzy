import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Eye, UserPlus, ShieldAlert, Ban } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "./my-hooks/createClient";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface Props {
  first_name: string | undefined;
  last_name: string | undefined;
}

interface Chat {
  id?: string;
  updated_at: string;
  created_by: string | undefined;
  chat_with: string;
  is_started: boolean;
}

export function PermissionSettingsInProfileDetails({
  first_name,
  last_name,
}: Props) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { id } = useParams();

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

  const { mutate } = useMutation({
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
        description: "There was an error while sending the request.",
      });
    },
  });

  const handleFinish = (oppositeUserId: string | undefined) => {
    if (!oppositeUserId) return; 
    mutate(oppositeUserId);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ChevronDown className=" hover:opacity-80 transition" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          {first_name} {last_name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Eye className="w-4 h-4 " />
          Allow profile access
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleFinish(id)}>
          <UserPlus className="w-4 h-4 " />
          Send request
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-red-700 focus:text-red-700">
          <ShieldAlert className="w-4 h-4 " />
          Report user
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-700 focus:text-red-700">
          <Ban className="w-4 h-4 " />
          Block user
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
