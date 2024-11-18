import { motion } from "framer-motion";

export const LastStep = () => {
  return (
    <div className="w-2/3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <h2 className="font-main text-4xl font-semibold  mt-24">
          Welcome to Twüzzy
        </h2>
        <p className="font-main font-medium  mt-2 opacity-85">
          Your avatar is your digital persona! Pick an image that shows the
          world who you really are—just remember, no pressure! It’s not like
          we’ll judge you for that cat picture... right?
        </p>
      </motion.div>
      <div className=" mt-5 space-y-4 ">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
        >
            <p className="text-5xl">😀😝😊😎</p>
        </motion.div>
      </div>
    </div>
  );
};
