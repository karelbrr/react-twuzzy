import bg_video from "@/assets/images/bg-footerv2.mp4";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo/twuzzy-logo.png";
import { Instagram, Github } from "lucide-react";

export const AboutPageFooter = () => {
  return (
    <section className="relative w-full h-[450px] overflow-hidden">
      <video
        src={bg_video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      ></video>
      <div className="absolute top-0 left-0 w-full h-full bg-violet-950/90 z-0"></div>
      <div className="relative w-full h-full flex">
        <div className="w-1/3 h-full relative flex flex-col justify-center pl-24">
          <div className="w-1/2 m-auto">
            <img src={logo} alt="logo" className="w-28" />
            <p className="my-3 opacity-90">
              Nad Ovčírnou IV 2528, 760 01 Zlín 1, Czech republic
            </p>
            <p className="opacity-90">&copy; twüzzy 2025</p>
          </div>
        </div>
        <div className="w-1/3 h-full relative flex flex-col justify-center">
          <Button
            variant={"link"}
            asChild
            className="w-1/6 text-md font-semibold ml-auto mr-auto"
          >
            <Link to={"/"}>Features</Link>
          </Button>
          <Button
            variant={"link"}
            asChild
            className="w-1/6 text-md font-semibold ml-auto mr-auto"
          >
            <Link to={"/"}>News</Link>
          </Button>
          <Button
            variant={"link"}
            asChild
            className="w-1/6 text-md font-semibold ml-auto mr-auto"
          >
            <Link to={"/"}>Support</Link>
          </Button>
          <div className="flex justify-center mt-5  space-x-3">
            <a className="hover:opacity-80 transition" href=""><Instagram  size={20}/></a>
            <a className="hover:opacity-80 transition" href="https://github.com/karelbrr/react-twuzzy" target="_blank" ><Github size={20} /></a>
          </div>
        </div>
        <div className="w-1/3 h-full relative flex flex-col justify-center pr-24">
          <Button
            variant={"link"}
            asChild
            className="w-1/6 text-md font-semibold ml-auto mr-auto"
          >
            <Link to={"/"}>Disclaimer</Link>
          </Button>
          <Button
            variant={"link"}
            asChild
            className="w-1/6 text-md font-semibold ml-auto mr-auto"
          >
            <Link to={"/"}>Testamonial</Link>
          </Button>
          <Button
            variant={"link"}
            asChild
            className="w-1/6 text-md font-semibold ml-auto mr-auto"
          >
            <Link to={"/"}>Privacy Policy</Link>
          </Button>
          <Button
            variant={"link"}
            asChild
            className="w-1/6 text-md font-semibold ml-auto mr-auto"
          >
            <Link to={"/"}>Terms of service</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
