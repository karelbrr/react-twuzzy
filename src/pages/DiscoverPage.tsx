import { Link, Outlet, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Heart,
  Stars,
  Tag,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

export const DiscoverPage = () => {
  const location = useLocation();

  

  return (
    <section className="h-screen flex ">
      <Helmet>
        <title>Explore | Twüzzy</title>
      </Helmet>
      <motion.div
        className=" w-1/6 border-r   "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
      >
        <div className=" mt-6 flex  items-baseline">
          <Button asChild variant={"outline"} className="ml-7">
            <Link to={"/"}>
              <ArrowLeft />
            </Link>
          </Button>
          <h3 className=" font-bold text-2xl  ml-3">Explore</h3>
        </div>
        <div className="pl-5 mt-5">
          <h4 className="pl-3 text-lg font-semibold">Discover</h4>
        </div>
        <div className="flex flex-col xl:ml-15 font-extralight mb-5 mt-2">
          <div className="flex  flex-col space-y-1">
            <Button
              className={`m-auto w-5/6 flex justify-start ${
                location.pathname === "/discover/featured" &&
                "bg-secondary opacity-90"
              }`}
              variant={"ghost"}
              asChild
            >
              <Link to={"/discover/featured"}>
                <Stars />
                Featured
              </Link>
            </Button>
            <Button
              className={`m-auto w-5/6 flex justify-start ${
                location.pathname === "/discover/people" &&
                "bg-secondary opacity-90"
              }`}
              variant={"ghost"}
              asChild
            >
              <Link to={"/discover/people"}>
                <User />
                People
              </Link>
            </Button>
            <Button
              className={`m-auto w-5/6 flex justify-start ${
                location.pathname === "/discover/groups" &&
                "bg-secondary opacity-90"
              }`}
              variant={"ghost"}
              asChild
            >
              <Link to={"/discover/groups"}>
                <Users />
                Groups
              </Link>
            </Button>
          </div>
        </div>
        <div className="pl-5 mt-5">
          <h4 className="pl-3 text-lg font-semibold">Topics & Events</h4>
        </div>

        <div className="flex flex-col mt-2 space-y-1">
          <Button
            className={`m-auto w-5/6 flex justify-start ${
              location.pathname === "/discover/topics" &&
              "bg-secondary opacity-90"
            }`}
            variant={"ghost"}
            asChild
          >
            <Link to={"/discover/topics"}>
              <Tag />
              Topics
            </Link>
          </Button>
          <Button
            className={`m-auto w-5/6 flex justify-start ${
              location.pathname === "/discover/events" &&
              "bg-secondary opacity-90"
            }`}
            variant={"ghost"}
            asChild
          >
            <Link to={"/discover/events"}>
              <Calendar />
              Events
            </Link>
          </Button>
        </div>
        <div className="pl-5 mt-5">
          <h4 className="pl-3 text-lg font-semibold">Trending & Ideas</h4>
        </div>
        <div className="flex flex-col mt-2 space-y-1">
          <Button
            className={`m-auto w-5/6 flex justify-start ${
              location.pathname === "/discover/trending" &&
              "bg-secondary opacity-90"
            }`}
            variant={"ghost"}
            asChild
          >
            <Link to={"/discover/trending"}>
              <TrendingUp />
              Trending
            </Link>
          </Button>
          <Button
            className={`m-auto w-5/6 flex justify-start ${
              location.pathname === "/discover/recommendations" &&
              "bg-secondary opacity-90"
            }`}
            variant={"ghost"}
            asChild
          >
            <Link to={"/discover/recommendations"}>
              <Heart />
              Recommendations
            </Link>
          </Button>
        </div>
      </motion.div>

      <div className="w-3/4">
        <Outlet />
      </div>
    </section>
  );
};
