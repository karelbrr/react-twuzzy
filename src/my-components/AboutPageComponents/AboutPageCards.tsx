import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Route, Zap, Camera } from "lucide-react";
import bg from "@/assets/images/bg-cards.jpg";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const AboutPageCards = () => {
  const features = [
    {
      icon: Zap,
      title: "Light Speed Chat Engine",
      description:
        "Experience the speed of real-time messaging with no delays, ensuring seamless communication at lightning-fast speeds, every time.",
    },
    {
      icon: Route,
      title: "Advanced Search & Connections",
      description:
        "Utilize cutting-edge algorithms to easily find new users and join relevant groups based on your interests, location, and activity, making connections faster than ever.",
    },
    {
      icon: Camera,
      title: "Quick Media Exchange",
      description:
        "Share photos, videos, documents, and much more with just a tap, allowing you to effortlessly stay connected with friends and family, share precious memories.",
    },
  ];

  return (
    <motion.div
      className="w-full m-auto "
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className=" w-3/4 m-auto">
        <h2 className="bg-[#010101] text-5xl text-left lg:w-full lg:text-7xl leading-none font-semibold opacity-70 relative">
          Faster than twüzzy <br /> is only{" "}
          <span className="font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            light
          </span>{" "}
          and{" "}
          <span className="font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            thunder.
          </span>{" "}
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        viewport={{ once: true, amount: 0.3 }}
        className="bg-cover bg-center lg:h-[850px]"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="lg:grid lg:grid-cols-3 space-y-5 lg:space-y-0 gap-6 pt-12 w-3/4 m-auto">
          {features.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <Card key={index} className="lg:pb-10 ">
                <CardHeader>
                  <Icon
                    strokeWidth={0.75}
                    className="size-20 my-7 text-violet-500/90"
                  />
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent className="opacity-70">
                  <p>{description}</p>
                </CardContent>
                <CardFooter>
                  <Button>Learn More</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
