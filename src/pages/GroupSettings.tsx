import { GroupSettingsUser } from "./../my-components/GroupSettingsUser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FindNewPeople } from "@/my-components/FindNewPeople";
import { motion } from "framer-motion";
//vyresit aby se tady nemohl nikdo dostat bez prihlaseni nebo created_by

export const GroupSettings = () => {
  return (
    <div className="h-[80%] lg:h-[72] xl:h-[80%] w-[82%] mt-24 ">
      <motion.section
        className="h-[94%] flex-col  overflow-auto pl-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
      >
        <h2 className="font-bold text-2xl mt-5 ">Group Settings</h2>
        <p className="text-muted-foreground mb-4">
          Manage your group visibility, members, and other preferences here.
        </p>
        <section className="space-y-5">
          <div className="flex flex-col gap-1.5 w-1/2 ">
            <Label htmlFor="first_name" className="text-md">
              Group Name
            </Label>
            <Input className="" placeholder="Group Name" />
          </div>
          <div className="flex flex-col gap-1.5 w-1/2">
            <Label htmlFor="first_name" className="text-md">
              Group Description
            </Label>
            <Input className="" placeholder="Short Group Description" />
          </div>
          <div className="flex flex-col gap-1.5 w-1/2">
            <Label className="text-md">Group Visibility</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Public" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-md">Users</Label>
            <div className="space-y-2 my-2">
              <GroupSettingsUser />
            </div>

            <FindNewPeople />
          </div>
        </section>
      </motion.section>
    </div>
  );
};
