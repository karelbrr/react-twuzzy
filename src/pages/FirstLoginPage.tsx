import { motion } from "framer-motion";
import logo from "../assets/logo/twuzzy-logo.png";
import { useMultistepForm } from "@/useMultistepForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FormOne } from "../my-components/formContent/FormOne";
import { FormTwo } from "../my-components/formContent/FormTwo";
import { FormThree } from "../my-components/formContent/FormThree";

export const FirstLoginPage = () => {
  type FormData = {
    firstName: string;
    lastName: string;
    birthday: {
      day: string;
      month: string;
      year: string;
    };
    username: string;
    description: string;
    avatar: string;
  };

  const initialData: FormData = {
    firstName: "",
    lastName: "",
    birthday: {
      day: "",
      month: "",
      year: "",
    },

    username: "",
    description: "",
    avatar: "",
  };

  const [data, setData] = useState(initialData);
  const updateForm = (fields: Partial<FormData>) => {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const { steps, currentStepIndex, isFirstStep, isLastStep, next, back } =
    useMultistepForm([
      <FormOne {...data} updateForm={updateForm} />,
      <FormTwo {...data} updateForm={updateForm} />,
      <FormThree {...data} updateForm={updateForm} />,
    ]);

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
        <div className=" justify-center flex h-[480px]">
          {steps[currentStepIndex]}
        </div>

        <div className="flex mt-14 w-2/3 justify-end m-auto space-x-4">
          {!isFirstStep && <Button onClick={back}>Previous</Button>}
          {isLastStep ? (
            <Button onClick={() => console.log(data)}>Finish</Button>
          ) : (
            <Button onClick={next}>Next</Button>
          )}
        </div>
      </section>
    </section>
  );
};
