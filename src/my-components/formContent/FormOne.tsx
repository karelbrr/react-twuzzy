import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserData = {
  firstName: string;
  lastName: string;
  birthday: {
    day: string;
    month: string;
    year: string;
  };
};
type UserFormProps = UserData & {
  updateForm: (fields: Partial<UserData>) => void;
};

export const FormOne = ({
  firstName,
  lastName,
  birthday,
  updateForm,
}: UserFormProps) => {
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
          <Label htmlFor="first-name" className="text-md font-light">
            First Name*
          </Label>
          <Input
            id="first-name"
            className="mt-1"
            value={firstName}
            onChange={(e) => updateForm({ firstName: e.target.value })}
          ></Input>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.6 } }}
        >
          <Label htmlFor="last-name" className="text-md font-light">
            Last Name*
          </Label>
          <Input
            id="last-name"
            className="mt-1"
            value={lastName}
            onChange={(e) => updateForm({ lastName: e.target.value })}
          ></Input>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.9 } }}
        >
          <Label className="text-md font-light">Date of Birth*</Label>
          <div className="flex space-x-4 mt-2">
            <div className="w-1/3 space-y-1">
              <Label className="font-light opacity-90">Day</Label>
              <Input
                placeholder="DD"
                type="number"
                name="day"
                value={birthday.day}
                onChange={(e) =>
                  updateForm({ birthday: { ...birthday, day: e.target.value } })
                } // Opravená část
              ></Input>
            </div>

            <div className="w-1/3 space-y-1">
              <Label className=" font-light opacity-90">Month</Label>
              <Input
                placeholder="MM"
                type="number"
                name="month"
                value={birthday.month}
                onChange={(e) =>
                  updateForm({ birthday: { ...birthday, month: e.target.value } })
                }
              ></Input>
            </div>
            <div className="w-1/3 space-y-1">
              <Label className=" font-light opacity-90">Year</Label>
              <Input
                placeholder="YYYY"
                type="number"
                name="year"
                value={birthday.year}
                onChange={(e) =>
                  updateForm({ birthday: { ...birthday, year: e.target.value } })
                }
              ></Input>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
