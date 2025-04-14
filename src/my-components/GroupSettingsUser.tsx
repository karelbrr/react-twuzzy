import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ban, Ellipsis, ShieldCheck, User } from "lucide-react";
import { Link } from "react-router-dom";

export function GroupSettingsUser() {
  return (
    <div className="flex justify-between border p-2 rounded-lg w-1/2">
      <p className="text-sm">Karel Braborec</p>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Ellipsis size={17} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <p>Karel Braborec</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ShieldCheck size={16} /> Verify user
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/profile/`}>
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
