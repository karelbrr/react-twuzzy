import { useAuth } from "@/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "./my-hooks/formatDate";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

export const SettingsAccount = () => {
  const { user } = useAuth();

  return (
    <motion.section
      className=""
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
    >
       <Helmet>
              <title>Settings Account | Twüzzy</title>
            </Helmet>
      <h2 className="font-bold text-2xl mx-10 mt-10 mb-5">Account Settings</h2>
      <div className="w-full justify-center flex">
        <Card className="ml-10 w-1/2">
          <CardHeader>
            <CardTitle>Update Your Account Information</CardTitle>
            <CardDescription>
              Quickly and easily update your account details
            </CardDescription>
          </CardHeader>
          <form className="space-y-5">
            <CardContent>
              <div className="flex flex-col  gap-1.5 ">
                <Label htmlFor="provider" className="text-md">
                  Provider
                </Label>
                <Input
                  id="provider"
                  placeholder={user?.app_metadata.provider}
                  disabled
                />
              </div>
              <div className="flex flex-col  gap-1.5 mt-5">
                <Label htmlFor="email" className="text-md">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder={user?.email}
                  disabled
                />
              </div>
              <div className="flex flex-col  gap-1.5 mt-5">
                <Label htmlFor="member" className="text-md">
                  Member from
                </Label>
                <Input
                  id="member"
                  placeholder={formatDate(user?.created_at || "")}
                  disabled
                />
              </div>
            </CardContent>
          </form>
        </Card>
        <Card className="ml-10 w-1/2 border-red-800 bg-red-700/30">
          <CardHeader className="opacity-90">
            <CardTitle className="">Danger Zone</CardTitle>
            <CardDescription className="">
              Manage sensitive account settings with caution
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex w-full justify-between items-center">
              <div>
                <h4 className="font-medium opacity-85">Delete your account</h4>
                <p className="opacity-60 text-xs">
                  This action is permanent and cannot be undone
                </p>
              </div>
              <div className="flex ">
                <Button variant={"destructive"}>Delete Account</Button>
              </div>
            </div>
            <div className="flex w-full justify-between items-center ">
              <div>
                <h4 className="font-medium opacity-85">
                  Deactivate your account
                </h4>
                <p className="opacity-60 text-xs">
                  Temporarily disable your account.
                </p>
              </div>
              <div className="flex">
                <Button variant={"destructive"}>Deactivate Account</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.section>
  );
};
