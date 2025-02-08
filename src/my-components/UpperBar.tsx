import { MyChatRequests } from "./MyChatRequests";
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
import { SquarePen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { CircleHelp } from "lucide-react";
import { getProfileData } from "./my-hooks/getProfileData";
import { User } from "src/my-components/types.tsx";
import { Badge } from "@/components/ui/badge";

export function UpperBar() {
  const { signOut, user } = useAuth();
  const {
    data,
    error: errorQuery,
    isLoading,
  } = useQuery<User, Error>({
    queryKey: ["profileDetailsUpperBar", user?.id],
    queryFn: () => getProfileData(user?.id),
  });

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="w-[82%] h-[10%] lg:h-[13%] xl:h-[10%] border-b fixed bg-background "
    >
      <div className="p-5 flex justify-end">
        <div className="flex w-full  max-w-sm justify-end items-center space-x-4 ">
          <MyChatRequests />

          <Sheet>
            <SheetTrigger>
              <Avatar className="size-12 max-h-12 max-w-12">
                <AvatarImage src={data?.avatar} />
                <AvatarFallback>
                  {data?.first_name?.substring(0, 1) || ""}
                  {data?.last_name?.substring(0, 1) || ""}
                </AvatarFallback>
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
                        <AvatarFallback>
                          {data?.first_name?.substring(0, 1) || ""}
                          {data?.last_name?.substring(0, 1) || ""}
                        </AvatarFallback>
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
                    <Button variant="ghost" className="mt-3" asChild>
                      <Link to={"settings/account"}>
                        <SquarePen />
                      </Link>
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

                <div className=" space-x-2 mt-5">
                  <h4 className="font-semibold opacity-90">My badges</h4>
                  {data?.badges.map((badge) => (
                    <Badge className="mt-1" key={badge.id}>{badge.badges.name}</Badge>
                  ))}
                </div>
                {errorQuery && (
                  <div className="border border-red-700 mt-5 p-3 text-red-700 rounded-lg">
                    <h4>Error</h4>
                    <p>{errorQuery.message}</p>
                  </div>
                )}
              </div>

              <SheetFooter className=" flex items-end">
                <div className="flex ">
                  <Button variant={"link"} className="opacity-90" asChild>
                    <Link to={"/news/1"}>
                      <Newspaper />
                      Explore News
                    </Link>
                  </Button>
                  <Button variant={"link"}>
                    {" "}
                    <CircleHelp />
                    Help
                  </Button>
                </div>
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
    </motion.section>
  );
}
