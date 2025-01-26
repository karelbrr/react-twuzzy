import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../my-hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Error as ErrorDiv } from "../Error";

type UserFormProps = {
  myBadges: Badge[];
  setMyBadges: React.Dispatch<React.SetStateAction<Badge[]>>;
};

interface Badge {
  id: string;
  name: string;
  user_id: string | undefined;
}

export const AddBadges = ({ myBadges, setMyBadges }: UserFormProps) => {
  const skeletonCount = 36;
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const { user } = useAuth();
  const fetchBadges = async (): Promise<Badge[]> => {
    const { data, error } = await supabase.from("badges").select("*");
    if (error) throw new Error(error.message);
    return data;
  };

  const AddBadgesToState = (newBadge: Badge) => {
    setMyBadges([...myBadges, newBadge]);
    setAvailableBadges(
      availableBadges.filter((badge) => badge.id !== newBadge.id)
    );
  };

  const RemoveBadgesFromState = (newBadge: Badge) => {
    setAvailableBadges([...availableBadges, newBadge]);
    setMyBadges(myBadges.filter((badge) => badge.id !== newBadge.id));
  };

  const { error: errorQuery, isLoading } = useQuery<Badge[], Error>({
    queryKey: ["BadgesForTheFirstLogin"],
    queryFn: async () => {
      const fetchedBadges = await fetchBadges();
      const filteredBadges = fetchedBadges.filter(
        (badge) => !myBadges.some((myBadge) => myBadge.id === badge.id)
      );
      setAvailableBadges(filteredBadges);
      return fetchedBadges;
    },
    refetchOnWindowFocus: false,
  });

  const badgeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-2/3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <h2 className="font-bold text-4xl  mt-24">Add a Personal Touch</h2>
        <p className=" font-medium text-justify  mt-2 opacity-85">
          You're almost there! Before finishing your setup, take a moment to
          personalize your profile by adding badges. Badges represent your
          interests, like swimming, hiking, cooking, and more. They’re a great
          way to showcase your hobbies and connect with others who share your
          passions.
        </p>
      </motion.div>

      <div className="mt-10 space-y-2 space-x-1 h-[200px]">
        {errorQuery && <ErrorDiv error={errorQuery?.message} />}
        {isLoading ? (
          <div className="inline-flex space-x-1 flex-wrap ">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <Skeleton key={index} className="w-24 h-6 rounded-lg mt-2" />
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {availableBadges?.map((badge, index) => (
              <motion.div
                className="inline-block"
                key={badge?.id}
                custom={index}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={badgeVariants}
              >
                <Badge
                  className="text-[11px] cursor-pointer"
                  onClick={() =>
                    AddBadgesToState({
                      id: badge.id,
                      name: badge.name,
                      user_id: user?.id,
                    })
                  }
                >
                  {badge.name}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.5 } }}
        className="mt-10 font-semibold opacity-90 text-lg"
      >
        My Badges
      </motion.h3>
      <div className="space-x-1 mt-1 h-[100px]">
        <AnimatePresence>
          {myBadges?.map((badge, index) => (
            <motion.div
              key={badge?.id}
              className="inline-block space-y-1"
              custom={index}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={badgeVariants}
            >
              <Badge
                variant={"secondary"}
                className="text-[12px] bg-gradient-to-r cursor-pointer from-violet-500 to-purple-500 opacity-90"
                onClick={() =>
                  RemoveBadgesFromState({
                    id: badge.id,
                    name: badge.name,
                    user_id: user?.id,
                  })
                }
              >
                {badge.name}
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
