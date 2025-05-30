import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "./my-hooks/createClient";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CopyPlus, SquarePlus } from "lucide-react";

export function JoinPublicGroup({ groupId }: { groupId: string }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleJoinGroup = async (groupId: string) => {
    const { data, error } = await supabase.from("group_members").insert({
      group_id: groupId,
      user_id: user?.id,
      is_joined: true,
      joined_at: new Date().toISOString(),
      is_verified: false,
    });
    if (error) {
      console.error("Error joining group:", error);
    } else {
      console.log("Successfully joined group:", data);
    }
  };

  const { mutate: handleDeleteChat } = useMutation({
    mutationFn: handleJoinGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      toast({
        title: "Joined the group",
        description: "Succesfully joined to the group",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to join the public group",
      });
    },
  });

  const onJoin = () => {
    handleDeleteChat(groupId);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="text-xs mt-3 px-2" variant={"outline"}>
          <CopyPlus />
          Join
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Do you want to join this group?</AlertDialogTitle>
          <AlertDialogDescription>
            By joining this group, you'll be able to see and participate in its
            discussions and events. You can leave the group at any time later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onJoin}>Join</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
