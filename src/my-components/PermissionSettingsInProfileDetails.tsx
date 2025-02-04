import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function PermissionSettingsInProfileDetails({}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ChevronDown className=" hover:opacity-80 transition" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Manage Permissions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Allow this user to see your profile
        </DropdownMenuItem>
        
        <DropdownMenuItem className="text-red-700 focus:text-red-700">
          Report User
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-700 focus:text-red-700">
          Block User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
