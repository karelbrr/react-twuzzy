import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SquarePen } from 'lucide-react';


export const SideBar = () => {
  return (
    <section className="h-screen w-[18%]  fixed border-r">
      <div className="flex justify-between">
        <h3 className="font-main font-semibold text-2xl m-auto w-4/5  mt-5 ml-5">
          Chats
        </h3>

        <Button className="mt-5 w-1/5 mr-4 " variant="outline"><SquarePen/></Button>
      </div>

      <div className="m-auto w-[90%] mt-4 font-main">
        <Button
          variant="outline"
          className=" w-full flex justify-start h-14 mb-3"
        >
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
          Patrik Novotný
        </Button>
        <Button
          variant="outline"
          className=" w-full flex justify-start h-14 mb-3"
        >
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          Jakub Slovák
        </Button>
      </div>
    </section>
  );
};
