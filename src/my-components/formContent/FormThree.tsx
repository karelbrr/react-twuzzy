import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserData = {
  avatar: string
};
type UserFormProps = UserData & {
  updateForm: (fields: Partial<UserData>) => void;
};

export const FormThree = ({avatar, updateForm}:UserFormProps) => {
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
          <Label htmlFor="avatar" className="text-md font-light">
            Avatar
          </Label>
          <Input id="avatar" className="mt-1" type="file"></Input>
        </motion.div>
      </div>
    </div>
  );
};
