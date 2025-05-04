import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ban, Ellipsis, ShieldBan, ShieldCheck, User } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "./my-hooks/createClient";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";

interface Props {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  is_joined: boolean;
}

export function GroupSettingsUser({
  id,
  user_id,
  first_name,
  last_name,
  is_verified,
  is_joined,
}: Props) {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const verifyUser = async ({
    memberId,
    is_verified,
  }: {
    memberId: string;
    is_verified: boolean;
  }) => {
    const { data, error } = await supabase
      .from("group_members")
      .update({ is_verified })
      .eq("id", memberId);
    if (error) throw new Error(error.message);
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: verifyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchGroupMembers"] });
    },
  });

  const handleVerify = () => {
    if (user?.id) mutate({ memberId: id, is_verified: true });
    console.log(id);
  };

  const handleUnverify = () => {
    if (user?.id) mutate({ memberId: id, is_verified: false });
  };

  return (
    <div className="flex justify-between border p-2 rounded-lg w-1/2">
      <p className="text-sm  flex items-center">
        {is_verified && <ShieldCheck size={15} className="mr-1" />}
        {first_name} {last_name}
        {!is_joined && (
          <span className="ml-2 text-muted-foreground">Request pending</span>
        )}
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis size={17} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <p>
              {first_name} {last_name}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {is_verified ? (
            <DropdownMenuItem onClick={handleUnverify}>
              <ShieldBan size={16} /> Unverify User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleVerify}>
              <ShieldCheck size={16} /> Verify User
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link to={`/profile/${user_id}`}>
              <User size={16} /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-700 focus:text-red-700">
            <Ban size={16} /> Remove User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
