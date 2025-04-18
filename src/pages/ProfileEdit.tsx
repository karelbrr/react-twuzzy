import { Link, Outlet, useLocation } from "react-router-dom";
import { CircleUser, Tag, UserPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Key } from "lucide-react";
import { MoveLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export const ProfileEdit = () => {
  const location = useLocation();

  return (
    <section className="h-screen flex ">
      <Helmet>
        <title>Settings | Twüzzy</title>
      </Helmet>
      <motion.div
        className=" w-1/6 border-r   "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
      >
        <div className=" mt-6 flex  items-baseline">
          <Button asChild variant={"outline"} className="ml-7">
            <Link to={"/"}>
              <MoveLeft />
            </Link>
          </Button>
          <h3 className=" font-bold text-2xl  ml-5">Settings</h3>
        </div>

        <div className="flex flex-col xl:ml-15 font-extralight mb-5 mt-5">
          <div className="flex  flex-col  space-y-2">
            <Button
              className={`m-auto w-5/6 flex justify-start ${
                location.pathname === "/settings/account" &&
                "bg-secondary opacity-90"
              }`}
              variant={"ghost"}
              asChild
            >
              <Link to={"/settings/account"}>
                <Key />
                Account
              </Link>
            </Button>
            <Button
              className={`m-auto w-5/6 flex justify-start ${
                location.pathname === "/settings/profile" &&
                "bg-secondary opacity-90"
              }`}
              variant={"ghost"}
              asChild
            >
              <Link to={"/settings/profile"}>
                <UserPen />
                Profile
              </Link>
            </Button>
            <Button
              className={`m-auto w-5/6 flex justify-start ${
                location.pathname === "/settings/avatar" &&
                "bg-secondary opacity-90"
              }`}
              variant={"ghost"}
              asChild
            >
              <Link to={"/settings/avatar"}>
                <CircleUser />
                Avatar
              </Link>
            </Button>
            <Button
              className={`m-auto w-5/6 flex justify-start ${
                location.pathname === "/settings/badges" &&
                "bg-secondary opacity-90"
              }`}
              variant={"ghost"}
              asChild
            >
              <Link to={"/settings/badges"}>
                <Tag />
                Badges
              </Link>
            </Button>
            <Button
              className={`m-auto w-5/6 flex justify-start ${
                location.pathname === "/settings/blocked" &&
                "bg-secondary opacity-90"
              }`}
              variant={"ghost"}
              asChild
            >
              <Link to={"/settings/blocked"}>
                <ShieldAlert />
                Blocked Users
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="w-3/4">
        <Outlet />
      </div>
    </section>
  );
};
