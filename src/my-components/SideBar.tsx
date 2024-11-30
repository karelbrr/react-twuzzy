import { FindNewPeople } from './FindNewPeople';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";



export const SideBar = () => {
  

 

  

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="h-screen w-[18%]  fixed border-r"
    >
      <div className="flex justify-between">
        <h3 className=" font-bold text-2xl m-auto w-4/5  mt-5 ml-5">Chats</h3>

        <FindNewPeople     />
      </div>

      <div className="m-auto w-[90%] mt-4 ">
        <Button
          variant="outline"
          className=" w-full flex justify-start h-14 mb-3"
        >
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
          Jan Novák
        </Button>
        <Button
          variant="outline"
          className=" w-full flex justify-start h-14 mb-3"
        >
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          Jan Novák
        </Button>
      </div>
    </motion.section>
  );
};
