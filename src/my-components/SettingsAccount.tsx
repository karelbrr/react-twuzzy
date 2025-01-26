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

export const SettingsAccount = () => {
  const { user } = useAuth();

  return (
    <motion.section className="" initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 0.2 } }}>
      <h2 className="font-bold text-2xl mx-10 mt-10 mb-5">Account Settings</h2>
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
    </motion.section>
  );
};
