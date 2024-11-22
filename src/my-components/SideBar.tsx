import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SquarePen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const SideBar = () => {
  return (
    <section className="h-screen w-[18%]  fixed border-r">
      <div className="flex justify-between">
        <h3 className="font-main font-semibold text-2xl m-auto w-4/5  mt-5 ml-5">
          Chats
        </h3>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-5 w-1/5 mr-4 " variant="outline">
              <SquarePen />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Discover new people to start chatting with.
              </DialogTitle>
            </DialogHeader>
            <div>
              <Command>
                <CommandInput placeholder="Search for people to chat with..." />
                <CommandList>
                  <CommandEmpty>
                    No people found. Please try again.
                  </CommandEmpty>
                  <CommandGroup>
                    <CommandItem className="cursor-pointer">
                      Patrik Braborec
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Jan Novák
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Petr Svoboda
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Martin Černý
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Jakub Dvořák
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Marek Novotný
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Tomáš Kovařík
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      David Němec
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Milan Horák
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Ondřej Kučera
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Filip Šimek
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Radek Král
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Michal Tichý
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Václav Růžička
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Lukáš Kratochvíl
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Roman Jirásek
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Jiří Mašek
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Karel Sýkora
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Zdeněk Havel
                    </CommandItem>
                    <CommandItem className="cursor-pointer">
                      Vladimír Malý
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </DialogContent>
        </Dialog>
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
    </section>
  );
};
