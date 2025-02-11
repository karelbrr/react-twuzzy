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

export function AboutPageCards() {
  return (
    <div className="w-full m-auto ">
      <h2 className="bg-[#010101] m-auto text-7xl leading-none text-center font-semibold opacity-70 relative">
        Faster then{" "}
        <span className="font-bold bg-gradient-to-r from-purple-500 via-violet-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
          twüzzy
        </span>{" "}
        is only light
      </h2>
      <div
        className="bg-cover bg-center h-[850px]"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        <div className="grid grid-cols-3 gap-6 pt-20 w-3/4 m-auto">
          <Card className="pb-10">
            <CardHeader>
              <Zap
                strokeWidth={0.75}
                className="size-20 my-7 text-violet-500"
              />
              <CardTitle>Light Speed Chat Engine</CardTitle>
            </CardHeader>
            <CardContent className="opacity-70">
              <p>
                Experience the speed of real-time messaging with no delays,
                ensuring seamless communication at lightning-fast speeds, every
                time.
              </p>
            </CardContent>
            <CardFooter>
              <Button>Learn More</Button>
            </CardFooter>
          </Card>
          <Card className="pb-10 ">
            <CardHeader>
              <Route
                strokeWidth={0.75}
                className="size-20 my-7 text-violet-500"
              />
              <CardTitle>Advanced Search & Connections</CardTitle>
            </CardHeader>
            <CardContent className="opacity-70">
              <p>
                Utilize cutting-edge algorithms to easily find new users and
                join relevant groups based on your interests, location, and
                activity, making connections faster than ever.
              </p>
            </CardContent>
            <CardFooter>
              <Button>Learn More</Button>
            </CardFooter>
          </Card>
          <Card className="pb-10 ">
            <CardHeader>
              <Camera
                strokeWidth={0.75}
                className="size-20 my-7 text-violet-500"
              />
              <CardTitle>Quick Media Exchange</CardTitle>
            </CardHeader>
            <CardContent className="opacity-70">
              <p>
                Share photos, videos, documents, and much more with just a tap,
                allowing you to effortlessly stay connected with friends and
                family, share precious memories.
              </p>
            </CardContent>
            <CardFooter>
              <Button>Learn More</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
