import { motion } from "framer-motion";
import logo from "../assets/logo/twuzzy-logo.png";
import { useMultistepForm } from "@/useMultistepForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const FirstLoginPage = () => {
  const { steps, currentStepIndex, isFirstStep, isLastStep, next, back } =
    useMultistepForm([<FormOne />, <FormTwo />, <FormThree/>]);

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
          {isLastStep ? <Button>Finish</Button> : <Button onClick={next}>Next</Button>}
        </div>
      </section>
    </section>
  );
};

export const FormOne = () => {
  return (
    <motion.div className="w-2/3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <h2 className="font-main text-4xl font-semibold  mt-24">Welcome!</h2>
        <p className="font-main font-medium  mt-2 opacity-85">
          We're glad to have you here! Please take a moment to tell us a little
          something about yourself...
        </p>
      </motion.div>
      <div className=" mt-10 space-y-4 ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
        >
          <Label htmlFor="first_name" className="text-md font-light">
            First Name*
          </Label>
          <Input id="first_name" className="mt-1"></Input>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.6 } }}
        >
          <Label htmlFor="last_name" className="text-md font-light">
            Last Name*
          </Label>
          <Input id="last_name" className="mt-1"></Input>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.9 } }}
        >
          <Label className="text-md font-light">Date of Birth*</Label>
          <div className="flex space-x-4 mt-2">
            <div className="w-1/3 space-y-1">
              <Label className="font-light opacity-90">Day</Label>
              <Input placeholder="DD" type="number"></Input>
            </div>

            <div className="w-1/3 space-y-1">
              <Label className=" font-light opacity-90">Month</Label>
              <Input placeholder="MM" type="number"></Input>
            </div>
            <div className="w-1/3 space-y-1">
              <Label className=" font-light opacity-90">Year</Label>
              <Input placeholder="YYYY" type="number"></Input>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const FormTwo = () => {
  return (
    <div className="w-2/3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <h2 className="font-main text-4xl font-semibold  mt-24">
          Almost Done!
        </h2>
        <p className="font-main font-medium  mt-2 opacity-85">
          We're just about finished! Before we complete your setup, please
          review the information you've provided and make any necessary
          changes...
        </p>
      </motion.div>
      <div className=" mt-10 space-y-4 ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
        >
          <Label htmlFor="usernamename" className="text-md font-light">
            Username*
          </Label>
          <Input id="username" className="mt-1"></Input>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.6 } }}
        >
          <Label htmlFor="last_name" className="text-md font-light ">
            Tell us Something About You..
          </Label>
          <Textarea className="mt-1 min-h-[130px] max-h-[170px]" />
        </motion.div>
      </div>
    </div>
  );
};

export const FormThree = () => {
  return (
    <div className="w-2/3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <h2 className="font-main text-4xl font-semibold  mt-24">
        Let’s Get You an Avatar
        </h2>
        <p className="font-main font-medium  mt-2 opacity-85">
          Your avatar is your digital persona! Pick an image that shows the
          world who you really are—just remember, no pressure! It’s not like
          we’ll judge you for that cat picture... right?
        </p>
      </motion.div>
      <div className=" mt-10 space-y-4 ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
        >
          <Label htmlFor="usernamename" className="text-md font-light">
            Avatar
          </Label>
          <Input id="username" className="mt-1" type="file" ></Input>
        </motion.div>
        
      </div>
    </div>
  );
};
