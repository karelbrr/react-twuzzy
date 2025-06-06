import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import logo from "@/assets/logo/twuzzy-logo.png";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/AuthProvider";
import { supabase } from "../my-hooks/createClient";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Error as ErrorDiv } from "../Error";
interface News {
  id: string;
  created_at: string;
  title: string;
  body: string;
}

export function AboutPageHeader() {
  const { user } = useAuth();

  const fetchNews = async (): Promise<News[]> => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("created_at", { ascending: false })
      .range(0, 2);

    if (error) throw new Error(error.message);
    return data;
  };

  const {
    data,
    error: errorQuery,
  } = useQuery<News[], Error>({
    queryKey: ["NewsForAboutPage"],
    queryFn: fetchNews,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className={` bg-gray-400/5 backdrop-blur-xl fixed w-full z-10 m-auto ${
        isMenuOpen ? "h-56" : "h-24"
      } lg:h-24 items-center`}
    >
      <div className="flex flex-col lg:flex-row xl:flex-row  items-center pt-6 w-3/4 m-auto">
        <div className="w-full lg:w-1/3 flex items-center justify-between lg:justify-normal">
          <img
            src={logo}
            alt="Twuzzy Logo"
            className="w-36 lg:w-36 opacity-90"
          />
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex lg:hidden"

            animate={{ rotate: isMenuOpen ? 180 : 0 }} // Animace otočení
            transition={{ duration: 0.3, ease: "easeInOut" }} // Plynulost animace
          >
            {isMenuOpen ? (
              <X size={32} strokeWidth={1} />
            ) : (
              <Menu size={32} strokeWidth={1} />
            )}
          </motion.button>
        </div>
        {isMenuOpen && (
          <div
            className="w-3/4 lg:w-1/3 flex mt-4 lg:mt-0 justify-center"
          >
            <NavigationMenu>
              <NavigationMenuList className="flex flex-col lg:flex-row">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Features
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6  w-[300px] md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-800/50 to-violet-900/50 p-6 no-underline outline-none focus:shadow-md"
                            to="/"
                          >
                            <p className="font-bold text-5xl">ü</p>
                            <div className="mb-2 mt-2 text-lg font-medium">
                              Features
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Fast, secure, and easy-to-use chat features for
                              everyone.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <div className="space-y-4 pt-2">
                        <div>
                          <h4 className="font-medium text-sm">
                            Real-time Messaging
                          </h4>
                          <p className="opacity-70 text-xs">
                            Enjoy instant messaging for smooth and continuous
                            conversations without any delays.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm">
                            End-to-End Encryption
                          </h4>
                          <p className="opacity-70 text-xs">
                            Keep your chats private with encryption that ensures
                            only you and the recipient can read them.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm">
                            Multimedia Sharing
                          </h4>
                          <p className="opacity-70 text-xs">
                            Share photos, videos, and files to make your
                            conversations more engaging.
                          </p>
                        </div>
                      </div>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    News
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6  w-[300px] md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-700/50 to-fuchsia-600/50 p-6 no-underline outline-none focus:shadow-md"
                            to="/news/1"
                          >
                            <p className="font-bold text-5xl">ü</p>
                            <div className="mb-2 mt-2 text-lg font-medium">
                              News
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Stay updated with the latest features,
                              improvements, and news about Twüzzy.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <div className="space-y-4">
                        {errorQuery && <ErrorDiv error={errorQuery.message}/> }
                        {data?.map((item) => (
                          <div key={item.id}>
                            <h4 className="font-medium text-sm">
                              {item.title}
                            </h4>
                            <p className="opacity-70 text-xs">
                              {item.body.split(" ").slice(0, 20).join(" ")}
                              {item.body.split(" ").length > 20 ? "..." : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">
                    Support
                  </NavigationMenuTrigger>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}

        <div className="w-1/3 hidden  lg:flex justify-end items-center">
          {user ? (
            <Button variant={"outline"} className="px-7" asChild>
              <Link to={"/"}>Back to app</Link>
            </Button>
          ) : (
            <Button variant={"outline"} className="px-7" asChild>
              <Link to={"/login"}>Log In</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
