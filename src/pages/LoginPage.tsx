import logo from "../assets/logo/twuzzy-logo.png";
import githubicon from "../assets/images/1a78d0af8893b3c26a97a6740e49a82f.png";
import discordicon from "../assets/images/png-clipart-white-flat-taskbar-icons-discord-online-game-chat-logo-illustration-thumbnail-removebg-preview.png";
import { motion } from "framer-motion";
import { useAuth } from "@/auth/AuthProvider";
import { Link, Navigate } from "react-router-dom";

export const LoginPage = () => {
  const { signInWithGitHub,signInWithDiscord, user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <section className="w-full flex bg-zinc-950">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.5 } }}
        className="w-2/3 gradient-background h-screen hidden md:block "
      >
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
          src={logo}
          alt=""
          className="w-36 m-8 opacity-90"
        />
      </motion.section>
      <section className=" w-full md:w-1/2 lg:w-1/3 bg-zinc-950 h-screen flex flex-col items-center justify-center">
        <motion.div className="flex flex-col justify-center h-5/6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3, delay: 0.2 } }}
            className=" text-white font-semibold text-4xl opacity-90 "
          >
            Log in to{" "}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 0.5, delay: 0.4},
              }}
              className="text-purple-500 font-bold"
            >
              Twüzzy
            </motion.span>
          </motion.h1>
          <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.5, delay: 0.7 },
            }}
          >
            <button
              onClick={signInWithGitHub}
              className="w-full mt-10 text-md bg-zinc-900 text-white flex justify-center items-center  py-3  rounded-xl hover:opacity-80 transition"
            >
              <img src={githubicon} alt="" className="w-7 mr-2" />
              Sign in with Github
            </button>
            <button onClick={signInWithDiscord} className="w-full  mt-5 text-md bg-indigo-600  text-white flex justify-center items-center py-3  rounded-xl hover:opacity-80 transition">
              <img src={discordicon} alt="" className="w-8 mt-1 mr-1" />
              Sign in with Discord
            </button>
          </motion.div>
        </motion.div>
        <div className="text-zinc-600 pt-10 text-sm lg:text-base font-light">
          <a href="" className="mr-1 hover:opacity-80 transition">
            Terms of Service
          </a>
          <span>|</span>
          <a href="" className="ml-1 mr-1 hover:opacity-80 transition">
            Privacy Policy
          </a>
          <span>|</span>
          <Link className="ml-1 hover:opacity-80 transition" to={"/about"}>about Twüzzy</Link>
        </div>
      </section>
    </section>
  );
};
