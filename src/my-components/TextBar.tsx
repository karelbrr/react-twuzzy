import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Image } from "lucide-react";
import { Laugh } from "lucide-react";

export const TextBar = () => {
  return (
    <section className="w-[82%] h-[10%] border-t">
      <div className="w-full flex space-x-3 justify-end pr-10">
        <Input
          className=" mt-7 w-3/4 text-md"
          placeholder="
Type your message here..."
        />
        <Button className="mt-7" variant="outline">
          <Image />
        </Button>
        <Button className="mt-7" variant="outline">
          <Laugh />
        </Button>

        <Button className="mt-7 ">
          <Send />
        </Button>
      </div>
    </section>
  );
};