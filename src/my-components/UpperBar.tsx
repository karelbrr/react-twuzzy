import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



export function UpperBar() {
 

  return (
    <section className="w-[82%]">
      {" "}
      <div className="p-5 flex justify-end">
        <div className="flex w-full max-w-sm items-center space-x-4 ">
          <Input type="email" placeholder="Search " />


          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>PN</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <hr className="" />
    </section>
  );
}