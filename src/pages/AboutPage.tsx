import { AboutPageHeader } from "../my-components/AboutPageComponents/AboutPageHeader";
import bg_video from "../assets/images/bg-final-edit.mp4";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AboutPageFeatures from "@/my-components/AboutPageComponents/AboutPageFeatures";
import { AboutPageCards } from "@/my-components/AboutPageComponents/AboutPageCards";
import { AboutPageFooter } from "@/my-components/AboutPageComponents/AboutPageFooter";
import { AboutPageQnA } from "@/my-components/AboutPageComponents/AboutPageQnA";

const About = () => {
  return (
    <section>
      <Helmet>
        <title>About | Twüzzy</title>
      </Helmet>
      <section className="relative w-full h-[800px] lg:h-screen overflow-hidden">
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

        <section className="relative z-5 flex w-full lg:w-3/4  mt-32 lg:mt-64 flex-col m-auto h-20 items-center">
          <h2 className=" text-left lg:text-center text-5xl lg:text-[85px] leading-none w-3/4 font-semibold opacity-70">
            Real-time conversations that bring people closer and create
            <span className="animate-gradient font-bold bg-gradient-to-r from-fuchsia-400/90 to-violet-500/90 bg-clip-text text-transparent">
              {" "}
              memories
            </span>
          </h2>

          <p className="my-7 lg:my-5 w-3/4 lg:mx-0 opacity-60 lg:w-1/2 text-left lg:text-center">
            Talk freely without barriers. Connect instantly with people around
            the world, building meaningful conversations in real-time.
          </p>
          <div className=" space-x-5 mt-2 lg:mt-2">
            <Button className="text-md py-7 lg:py-5 lg:text-sm  opacity-90 w-36">Get started</Button>
            <Button className="text-md py-7 lg:py-5 lg:text-sm  opacity-90 w-32" variant={"outline"} asChild>
              <Link to={"/news/1"}>Whats New?</Link>
            </Button>
          </div>
        </section>
        <div className="absolute bottom-0 left-0 w-full h-[100px] lg:h-[280px]  bg-gradient-to-t from-black  to-transparent"></div>
      </section>
      <AboutPageFeatures />
      <AboutPageCards />
      <AboutPageQnA/>
      <AboutPageFooter />
      
    </section>
  );
};

export default About;
