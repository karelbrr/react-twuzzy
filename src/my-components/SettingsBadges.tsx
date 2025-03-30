import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "./my-hooks/createClient";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Error as ErrorDiv } from "./Error";
import { useAuth } from "@/auth/AuthProvider";
import { useState, useEffect } from "react";

interface Badge {
  id: string;
  name: string;
  user_id: string | undefined;
  badges: {
    id: number;
    name: string;
  };
}

export const SettingsBadges = () => {
  const skeletonCount = 36;
  const { user } = useAuth();
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);

  const fetchMyBadges = async (): Promise<Badge[]> => {
    const { data, error } = await supabase
      .from("user_badges")
      .select("*,badges!badge_id (id, name)")
      .eq("user_id", user?.id);
    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data: MyBadges,
    error: errorQueryMyBadges,
    isLoading: isLoadingMyBadges,
  } = useQuery<Badge[], Error>({
    queryKey: ["MyBadgesForSettings"],
    queryFn: fetchMyBadges,
  });

  const fetchBadges = async (): Promise<Badge[]> => {
    const { data, error } = await supabase.from("badges").select("*");
    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data: Badges,
    error: errorQueryBadges,
    isLoading: isLoadingBadges,
  } = useQuery<Badge[], Error>({
    queryKey: ["BadgesForSettings"],
    queryFn: fetchBadges,
  });

  useEffect(() => {
    if (Badges && MyBadges) {
      const filteredBadges = Badges.filter(
        (badge) =>
          !MyBadges.some(
            (myBadge) => String(myBadge.badges.id) === String(badge.id) 
          )
      );

      setAvailableBadges(filteredBadges);
    }
  }, [Badges, MyBadges]);

  return (
    <section>
      <h2 className="font-bold text-2xl mt-10 mx-10">Customize Badges</h2>

      <h3 className="ml-10 mt-5 font-semibold">Available Badges</h3>
      <div className="mt-2 space-y-2 space-x-1 ml-10 w-3/4">
        {errorQueryBadges && <ErrorDiv error={errorQueryBadges.message} />}

        {isLoadingBadges ? (
          <div className="inline-flex space-x-1 flex-wrap">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <Skeleton key={index} className="w-24 h-6 rounded-lg mt-2" />
            ))}
          </div>
        ) : (
          <div className="inline-flex flex-wrap">
            {availableBadges?.map((badge) => (
              <div className="inline-block" key={badge.id}>
                <Badge className="text-[11px] mr-1 mb-1 cursor-pointer ">
                  {badge.name}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 className="ml-10 mt-5 font-semibold">My Badges</h3>
      <div className="mt-2 space-y-2 space-x-1 ml-10 w-3/4">
        {errorQueryMyBadges && <ErrorDiv error={errorQueryMyBadges.message} />}

        <div className="inline-flex flex-wrap">
          {MyBadges?.map((badge) => (
            <div className="inline-block" key={badge.id}>
              <Badge className="text-[11px] mr-1 mb-1 cursor-pointer bg-gradient-to-r text-white from-violet-700 to-purple-700">
                {badge.badges.name}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
