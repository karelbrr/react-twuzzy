import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "./my-hooks/createClient";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Badge {
  id: string;
  name: string;
}

interface UserBadge {
  id: string;
  user_id: string;
  badges: Badge;
}

export const SettingsBadges = () => {
  const { toast } = useToast();
  const skeletonCount = 36;
  const { user } = useAuth();
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [myBadges, setMyBadges] = useState<UserBadge[]>([]);

  const fetchMyBadges = async (): Promise<UserBadge[]> => {
    const { data, error } = await supabase
      .from("user_badges")
      .select("*,badges!badge_id (id, name)")
      .eq("user_id", user?.id);
    if (error) throw new Error(error.message);
    return data || [];
  };

  const fetchBadges = async (): Promise<Badge[]> => {
    const { data, error } = await supabase.from("badges").select("*");
    if (error) throw new Error(error.message);
    return data || [];
  };

  const { data: MyBadgesFetched } = useQuery<UserBadge[]>({
    queryKey: ["MyBadgesForSettings"],
    queryFn: fetchMyBadges,
  });

  const { data: Badges } = useQuery<Badge[]>({
    queryKey: ["BadgesForSettings"],
    queryFn: fetchBadges,
  });

  useEffect(() => {
    if (Badges && MyBadgesFetched) {
      const myBadgeIds = MyBadgesFetched.map((b) => b.badges.id);
      setAvailableBadges(Badges.filter((b) => !myBadgeIds.includes(b.id)));
      setMyBadges(MyBadgesFetched);
    }
  }, [Badges, MyBadgesFetched]);

  const addBadgeToState = (badge: Badge) => {
    setMyBadges([
      ...myBadges,
      { id: "", user_id: user?.id || "", badges: badge },
    ]);
    setAvailableBadges(availableBadges.filter((b) => b.id !== badge.id));
  };

  const removeBadgeFromState = (userBadge: UserBadge) => {
    setAvailableBadges([...availableBadges, userBadge.badges]);
    setMyBadges(myBadges.filter((b) => b.badges.id !== userBadge.badges.id));
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.2 } }}
    >
      <h2 className="font-bold text-2xl mt-10 mx-10">Customize Badges</h2>
      <Card className="ml-10 mt-5">
        <CardHeader>
          <CardTitle>Manage Your Badges</CardTitle>
          <CardDescription>
            Select which badges to display on your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h3 className=" font-semibold">Available Badges</h3>
          <div className="mt-2 space-y-2 space-x-1  w-3/4 min-h-[150px]">
            {Badges ? (
              <div className="inline-flex flex-wrap">
                {availableBadges.map((badge) => (
                  <div className="inline-block" key={badge.id}>
                    <Badge
                      className="text-[11px] mr-1 mb-1 cursor-pointer"
                      onClick={() => addBadgeToState(badge)}
                    >
                      {badge.name}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="inline-flex space-x-1 flex-wrap">
                {Array.from({ length: skeletonCount }).map((_, index) => (
                  <Skeleton key={index} className="w-24 h-5 rounded-lg mt-2" />
                ))}
              </div>
            )}
          </div>

          <h3 className=" mt-5 font-semibold">My Badges</h3>
          <div className="mt-2 space-y-2 space-x-1 w-3/4">
            <div className="inline-flex flex-wrap">
              {myBadges.map((badge) => (
                <div className="inline-block" key={badge.badges.id}>
                  <Badge
                    className="text-[11px] mr-1 mb-1 cursor-pointer bg-gradient-to-r text-white from-violet-700 to-purple-700"
                    onClick={() => removeBadgeFromState(badge)}
                  >
                    {badge.badges.name}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant={"outline"} onClick={() => updateBadges(myBadges)}>
            Save changes
          </Button>
        </CardFooter>
      </Card>
    </motion.section>
  );
};
