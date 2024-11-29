import { useAuth } from "@/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SettingsAccount = () => {
  const { user } = useAuth();

  return (
    <section className="">
      <h2 className="font-bold text-3xl m-10">Account Settings</h2>
      <form className="space-y-5">
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="provider">Provider</Label>
          <Input id="provider" placeholder="GitHub" disabled />
        </div>
        <div className="flex flex-col w-1/3 gap-1.5 ml-10">
          <Label htmlFor="provider">Email</Label>
          <Input id="email" placeholder={user?.email} disabled />
        </div>
      </form>
    </section>
  );
};
