import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Image } from "lucide-react";
import { Laugh } from "lucide-react";

export const TextBar = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="h-[4%] border-t"
    >
      <div className="w-full flex space-x-3 justify-end pr-10">
        <Input
          className=" mt-10 w-3/4 text-md"
          placeholder="
Type your message here..."
        />
        <Button className="mt-10" variant="outline">
          <Image />
        </Button>
        <Button className="mt-10" variant="outline">
          <Laugh />
        </Button>

        <Button className="mt-10 ">
          <Send />
        </Button>
      </div>
    </motion.section>
  );
};
