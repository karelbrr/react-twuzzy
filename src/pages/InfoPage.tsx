import { Outlet } from "react-router-dom";
import logo from "@/assets/logo/twuzzy-logo.png";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const InfoPage = () => {
  return (
    <section className="h-screen ">
      <Helmet>
        <title>Info | Twüzzy</title>
      </Helmet>
      <div className="w-3/4 m-auto py-5 flex justify-between">
        <div className="flex items-center w-1/2">
          <img
            src={logo}
            alt="Twuzzy Logo"
            className="w-36 lg:w-36 opacity-90"
          />
          <div className="ml-5 flex">
            <Button variant={"link"}>News</Button>
            <Button variant={"link"}>Help</Button>
            <Button variant={"link"}>Docs</Button>
          </div>
        </div>
        <div className="w-1/2 flex justify-end items-center space-x-2">
          <Button variant={"outline"} className="rounded-xl bg-zinc-800 h-8 w-48 flex justify-between"><p className="text-muted-foreground">Search...</p> <p className="text-muted-foreground">⌘K</p></Button>
          
        </div>
      </div>
      <Separator className="w-3/4 m-auto" />

      <div className="w-3/4 m-auto ">
        <Outlet />
      </div>
    </section>
  );
};
