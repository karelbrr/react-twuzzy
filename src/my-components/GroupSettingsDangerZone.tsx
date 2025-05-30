import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./my-hooks/createClient";
import { toast } from "@/hooks/use-toast";

export function GroupSettingsDangerZone() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteGroupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .delete()
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Group deleted",
        description: "The group was successfully removed.",
      });

      queryClient.invalidateQueries({ queryKey: ["fetchGroupsForGroupList"] });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete group.",
      });
    },
  });

  return (
    <Card className="border-red-800 bg-red-700/30">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>
          Permanent actions that cannot be undone. Proceed with caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex w-full justify-between items-center">
          <div>
            <h4 className="font-medium opacity-85">Delete this group</h4>
            <p className="opacity-60 text-xs">
              This action is permanent and cannot be undone
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex">
                <Button variant={"destructive"}>Delete Group</Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure you want to delete this group?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Deleting the group will remove
                  all its data and members. Make sure you really want to
                  proceed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteGroupMutation.mutate()}
                  disabled={deleteGroupMutation.isPending}
                >
                  Delete Group
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex w-full justify-between items-center">
          <div>
            <h4 className="font-medium opacity-85">Archive this group</h4>
            <p className="opacity-60 text-xs">
              This action isn't permanent and can be undone
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex">
                <Button variant={"destructive"}>Archive Group</Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to archive this group?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Archiving will disable activity within the group but preserve
                  its data and members. You can unarchive it later if needed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Archive Group</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
