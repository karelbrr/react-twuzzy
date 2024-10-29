import { Button } from "@/components/ui/button";
import logo from "../assets/logo/twuzzy-logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const SideBar = () => {
  return (
    <section className="h-screen w-[18%]  fixed border-r">
      <div className="mt-10 ml-10">
        <img src={logo} alt="" className="w-36 opacity-90" />
      </div>

      <h3 className="font-main font-semibold text-2xl m-auto w-[90%] mt-10">
        Chats
      </h3>
      <div className="m-auto w-[90%] mt-4 font-main">
        <Button variant="outline" className=" w-full flex justify-start h-14 mb-4">
          <Avatar >
            <AvatarImage src="" />
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
          Patrik Novotný
        </Button>
        <Button variant="outline" className=" w-full flex justify-start h-14 mb-4">
          <Avatar >
            <AvatarImage src="" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          Jakub Slovák
        </Button>
        
      </div>
    </section>
  );
};
