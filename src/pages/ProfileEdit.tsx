import { Link, Outlet } from "react-router-dom";
import { UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Key } from "lucide-react";
import { ExternalLink } from "lucide-react";

export const ProfileEdit = () => {
  return (
    <section className=" h-screen flex ">
      <div className=" w-1/6 border-r   ">
        <div className="border-b mt-6 pb-6 pl-8 flex items-baseline">
          <h3 className=" font-bold text-2xl m-auto ">Settings</h3>
          <Button asChild variant={"outline"} className="mr-5">
            <Link to={"/"}>
              <ExternalLink />
              Chats
            </Link>
          </Button>
        </div>
        <div className="flex flex-col ml-10 m-auto mt-5 font-extralight">
          <div className="flex flex-col w-5/6  space-y-1">
            <Link
              to={"/settings/account"}
              className="px-5   font-medium  hover:underline hover:underline-offset-4 items-baseline text-left  flex w-full text-sm"
            >
              <Key size={15} className="mr-1" />
              Account
            </Link>

            <Link
              to={"/settings/profile"}
              className="px-5   font-medium  hover:underline hover:underline-offset-4 items-baseline text-left  flex w-full text-sm"
            >
              <UserPen size={15} className="mr-1 " />
              Profile
            </Link>

            <Link
              to={"/settings/blocked"}
              className="px-5   font-medium  hover:underline hover:underline-offset-4 items-baseline text-left text-sm flex w-full"
            >
              <ShieldAlert size={15} className="mr-1" />
              Blocked People
            </Link>
          </div>
        </div>
      </div>
      <div className="w-3/4">
        <Outlet />
      </div>
    </section>
  );
};
