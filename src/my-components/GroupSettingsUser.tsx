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

interface Props {
  id: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
}

export function GroupSettingsUser({
  id,
  first_name,
  last_name,
  is_verified,
}: Props) {
  return (
    <div className="flex justify-between border p-2 rounded-lg w-1/2">
      <p className="text-sm  flex items-center">
        {is_verified && <ShieldCheck size={15} className="mr-1" />}
        {first_name} {last_name}
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
            <DropdownMenuItem>
              <ShieldBan size={16} /> Unverify User
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem>
              <ShieldCheck size={16} /> Verify User
            </DropdownMenuItem>
          )}

          <DropdownMenuItem asChild>
            <Link to={`/profile/${id}`}>
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
