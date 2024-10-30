import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthProvider";
import { MailQuestion } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SquarePen } from "lucide-react";
import { supabase } from "./createClient";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  avatar: string;
  desc: string;
}

export function UpperBar() {
  const { signOut, user } = useAuth();

  const fetchUserData = async (): Promise<User> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  };

  const { data, error: errorQuery, isLoading } = useQuery<User, Error>({
    queryKey: ["profileData"],
    queryFn: fetchUserData,
  });

  return (
    <section className="w-[82%] h-[10%] border-b ">
      <div className="p-5 flex justify-end">
        <div className="flex w-full  max-w-sm justify-end space-x-4 ">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="mt-2">
                  <MailQuestion />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Message requests</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Sheet>
            <SheetTrigger>
              <Avatar className="size-12 max-h-12 max-w-12">
                <AvatarImage src={data?.avatar} />
                <AvatarFallback>{data?.first_name.substring(0, 1)}{data?.last_name.substring(0, 1)}</AvatarFallback>
              </Avatar>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <div className="flex mt-6 justify-between ">
                  <div className="flex ">
                    {isLoading || errorQuery ? (
                      <Skeleton className="w-[65px] h-[65px] rounded-full" />
                    ) : (
                      <Avatar className="size-16 text-xl">
                        <AvatarImage src={data?.avatar} />
                        <AvatarFallback>{data?.first_name.substring(0, 1)}{data?.last_name.substring(0, 1)}</AvatarFallback>
                      </Avatar>
                    )}

                    {isLoading || errorQuery ? (
                      <SheetTitle className=" text-xl">
                        <Skeleton className="w-[150px] h-[20px] ml-4 mt-5  rounded-full" />
                      </SheetTitle>
                    ) : (
                      <SheetTitle className=" ml-4 mt-4 text-xl">
                        {data?.first_name} {data?.last_name}
                      </SheetTitle>
                    )}
                  </div>

                  {isLoading || errorQuery ? (
                    <Button disabled variant="ghost" className="mt-3">
                      <SquarePen />
                    </Button>
                  ) : (
                    <Button variant="ghost" className="mt-3">
                      <SquarePen />
                    </Button>
                  )}
                </div>
              </SheetHeader>
              <div className="mt-5 h-5/6">
                {isLoading || errorQuery ? (
                  <div className="space-y-2">
                  <Skeleton className="w-[330px] h-[20px]  rounded-full" />
                  <Skeleton className="w-[330px] h-[20px]  rounded-full" />
                  <Skeleton className="w-[250px] h-[20px]  rounded-full" />

                  </div>
                ) : (
                  <SheetDescription className="text-justify">
                    {data?.desc}
                  </SheetDescription>
                )}
              </div>
              <SheetFooter className="flex items-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="mt-2" variant="outline">
                      Log Out
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to log out?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to log out? You’ll be signed out
                        of your account and returned to the login page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={signOut}>
                        Log Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}
