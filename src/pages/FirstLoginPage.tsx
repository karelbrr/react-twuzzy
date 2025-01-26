import { motion } from "framer-motion";
import logo from "../assets/logo/twuzzy-logo.png";
import { useMultistepForm } from "@/my-components/my-hooks/useMultistepForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormOne } from "../my-components/formContent/FormOne";
import { FormTwo } from "../my-components/formContent/FormTwo";
import { FormThree } from "../my-components/formContent/FormThree";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "@/my-components/my-hooks/createClient";
import { useNavigate } from "react-router-dom";
import { LastStep } from "@/my-components/formContent/LastStep";
import { AddBadges } from "@/my-components/formContent/AddBadges";

type FormData = {
  first_name: string;
  last_name: string;
  birthday: {
    day: string;
    month: string;
    year: string;
  };
  first_login: boolean;
  username: string;
  desc: string;
  avatar: string;
};

const initialData: FormData = {
  first_name: "",
  last_name: "",
  birthday: {
    day: "",
    month: "",
    year: "",
  },
  first_login: false,
  username: "",
  desc: "",
  avatar: "",
};

interface Badge {
  id: string;
  name: string;
  user_id: string | undefined;
}

export const FirstLoginPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(initialData);
  const [myBadges, setMyBadges] = useState<Badge[]>([]);

  const updateForm = (fields: Partial<FormData>) => {
    setUserData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const AddProfile = async (updatedProfile: Partial<FormData>) => {
    if (!user?.id) {
      throw new Error("User ID is missing");
    }

    const updatedProfileWithBirthday = {
      ...updatedProfile,
      birthday: [
        updatedProfile.birthday?.day,
        updatedProfile.birthday?.month,
        updatedProfile.birthday?.year,
      ],
    };

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .update(updatedProfileWithBirthday)
      .eq("id", user.id);

    if (profileError) throw new Error(profileError.message);

    const updatedBadges = myBadges.map((badge) => ({
      badge_id: badge.id,
      user_id: user?.id,
    }));
    const { data: badgesData, error: badgesError } = await supabase
      .from("user_badges")
      .insert(updatedBadges);

    if (badgesError) throw new Error(badgesError.message);
    return { profileData, badgesData };
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: AddProfile,
  });

  const { steps, currentStepIndex, isFirstStep, isLastStep, next, back } =
    useMultistepForm([
      <FormOne {...userData} updateForm={updateForm} />,
      <FormTwo {...userData} updateForm={updateForm} />,
      <AddBadges myBadges={myBadges} setMyBadges={setMyBadges} />,
      <FormThree {...userData} updateForm={updateForm} />,
      <LastStep />,
    ]);

  const handleFinish = () => {
    mutate(userData);
  };

  return (
    <section className="flex">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.5 } }}
        className="w-1/3 gradient-background h-screen"
      >
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
          src={logo}
          alt=""
          className="w-36 m-8 opacity-90"
        />
      </motion.section>
      <section className="w-2/3 h-screen ">
        <div
          className={`justify-center flex  ${
            currentStepIndex === 2 ? " h-[600px] " : "h-[480px]"
          } `}
        >
          {steps[currentStepIndex]}
        </div>

        <div className="flex mt-14 w-2/3 justify-end m-auto space-x-4">
          {!isFirstStep && <Button onClick={back}>Previous</Button>}
          {currentStepIndex === 3 ? (
            <Button
              onClick={() => {
                next();
                console.log(myBadges);

                handleFinish();
              }}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Submit"}
            </Button>
          ) : isLastStep ? (
            <Button onClick={() => navigate("/")}>Jump into Twüzzy!</Button>
          ) : (
            <Button onClick={next}>Next</Button>
          )}
        </div>
      </section>
    </section>
  );
};
