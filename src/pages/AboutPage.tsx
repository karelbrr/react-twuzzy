import { AboutPageHeader } from "../my-components/AboutPageComponents/AboutPageHeader";

import bg_video from "../assets/images/bg-final-edit.mp4";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <section>
      <Helmet>
        <title>About | Twüzzy</title>
      </Helmet>
      <section className="relative w-full h-screen overflow-hidden">
        <video
          src={bg_video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        ></video>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <AboutPageHeader />

        <section className="relative z-5 flex w-3/4 mt-64 flex-col m-auto h-20 items-center">
          <h2 className=" text-center text-[85px] leading-none w-3/4 font-semibold opacity-70">
            Real-time conversations that bring people closer and create
            <span className="font-bold bg-gradient-to-r from-fuchsia-400/90 to-violet-500/90 bg-clip-text text-transparent">
              {" "}
              memories.
            </span>
          </h2>

          <p className="my-5 opacity-60 w-1/2 text-center">
            Talk freely without barriers. Connect instantly with people around
            the world, building meaningful conversations in real-time.
          </p>
          <div className=" space-x-2 mt-2">
            <Button className="  opacity-90 w-36">Getting started</Button>
            <Button className="  opacity-90 w-32" variant={"outline"} asChild>
              <Link to={"/news/1"}>Whats New?</Link>
            </Button>
          </div>
        </section>
        <div className="absolute bottom-0 left-0 w-full h-[280px]  bg-gradient-to-t from-black  to-transparent"></div>
      </section>
      <section className="h-screen bg-[#010101]"></section>
    </section>
  );
};

export default About;
