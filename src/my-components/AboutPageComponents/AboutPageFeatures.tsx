import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";


interface Inputs {
  theme: string;
}

const AboutPageFeatures = () => {
  const { watch, setValue } = useForm<Inputs>({
    defaultValues: {
      theme: "am",
    },
  });

  const chatMessages = [
    { text: "Hey, have you tried Twüzzy chat? It's awesome! 😎", side: "left" },
    { text: "No, I haven't yet. What makes it stand out?", side: "right" },
    {
      text: "The UI is super intuitive, and the real-time messaging is seamless. No delays!",
      side: "left",
    },
    {
      text: "Sounds interesting! What about security? Is it safe?",
      side: "right",
    },
    {
      text: "For sure! It uses end-to-end encryption, so no one else can read your messages.",
      side: "left",
    },
  ];

  return (
    <section className=" bg-[#010101] pb-32">
      <div className="w-3/4 m-auto flex mb-32">
        <div className="w-5/12 ">
          <h2 className="leading-tight mt-10 text-[68px] m-auto font-semibold opacity-70">
            An intuitive and responsive chat experience with{" "}
            <span
              className={`font-extrabold ${
                watch("theme") === "am"
                  ? "bg-gradient-to-b from-purple-500 to-violet-500 bg-clip-text text-transparent"
                  : watch("theme") === "on"
                  ? "bg-gradient-to-b from-zinc-500 to-zinc-700 bg-clip-text text-transparent"
                  : watch("theme") === "az"
                  ? "bg-gradient-to-b from-blue-600 to-sky-600 bg-clip-text text-transparent"
                  : ""
              }`}
            >
              twüzzy
            </span>
          </h2>
          <div className="mt-10">
            <div className="space-x-4">
              <Button asChild>
                <Link to={"/login"} className="px-6">
                  Get Started
                </Link>
              </Button>
              <Button variant={"outline"} className="px-6">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="w-7/12 flex flex-col opacity-90">
          <div className="ml-auto ">
            <Select
              value={watch("theme")}
              onValueChange={(value) => setValue("theme", value)}
            >
              <SelectTrigger className="w-[150px] ">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="am">🟣 Amethyst</SelectItem>
                <SelectItem value="on">⚫ Onyx</SelectItem>
                <SelectItem value="az">🔵 Azurea</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`fake-message ${
                message.side === "left" ? "mr-auto" : "ml-auto"
              } ${
                (watch("theme") === "am" &&
                  "from-purple-700/60 to-violet-600/60") ||
                (watch("theme") === "on" && "") ||
                (watch("theme") === "az" && "from-blue-600/80 to-sky-600/80")
              } `}
            >
              <p>{message.text}</p>
            </div>
          ))}
          <div
            className={`fake-message
                ml-auto ${
                  (watch("theme") === "am" &&
                    "from-purple-700/60 to-violet-600/60") ||
                  (watch("theme") === "on" && "") ||
                  (watch("theme") === "az" && "from-blue-600/80 to-sky-600/80")
                }
              `}
          >
            <p>That’s awesome! I’m definitely going to check it out.</p>
            <div className="absolute left-2 text-xl bottom-[-15px]">❤️</div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default AboutPageFeatures;
