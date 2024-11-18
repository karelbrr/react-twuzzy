import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type UserData = {
  username: string;
  desc: string;
};
type UserFormProps = UserData & {
  updateForm: (fields: Partial<UserData>) => void;
};

export const FormTwo = ({ username, desc, updateForm }: UserFormProps) => {
  return (
    <div className="w-2/3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <h2 className="font-main text-4xl font-semibold  mt-24">
          Share a Little About Yourself
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
          <Label htmlFor="username" className="text-md font-light">
            Username*
          </Label>
          <Input
            id="username"
            className="mt-1"
            value={username}
            onChange={(e) => updateForm({ username: e.target.value })}
          ></Input>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.6 } }}
        >
          <Label htmlFor="description" className="text-md font-light ">
            Tell us Something About You..
          </Label>
          <Textarea
            id="description"
            value={desc}
            className="mt-1 min-h-[130px] max-h-[170px]"
            onChange={(e) => updateForm({ desc: e.target.value })}
          />
        </motion.div>
      </div>
    </div>
  );
};
