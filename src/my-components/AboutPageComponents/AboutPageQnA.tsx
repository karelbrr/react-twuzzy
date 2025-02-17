import { CustomQnAHeading } from "./CustomQnAHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import bg from "@/assets/images/qna-bg-4.png";
import { motion } from "framer-motion";

export const AboutPageQnA = () => {
  const faqData = [
    {
      question: "Is Twüzzy really free to use?",
      answer:
        "Absolutely! Twüzzy is completely free to use—no hidden fees, no annoying subscriptions. Just download and start chatting!",
    },
    {
      question: "Will Twüzzy be available on PC?",
      answer:
        "We’re working on it! While Twüzzy is available on mobile right now, we're planning a PC version soon so you can chat wherever you are.",
    },
    {
      question: "Can I use Twüzzy on both iOS and Android?",
      answer:
        "Yes, you can! Twüzzy works seamlessly on both iOS and Android devices. Whether you're an Apple fan or Android enthusiast, we’ve got you covered.",
    },
    {
      question:
        "Is there a limit to the number of people I can add to a group chat?",
      answer:
        "No limit here! You can add as many people as you want to a group chat. Perfect for chatting with friends, family, or even your entire team.",
    },
    {
      question: "Can I customize my Twüzzy experience?",
      answer:
        "Totally! You can personalize your profile, change themes, and set up notifications the way you want. Make Twüzzy truly yours!",
    },
  ];

  return (
    <section className="bg-[#010101] pb-36 lg:pb-0 lg:h-screen">
      <div className=" w-3/4 m-auto flex lg:flex-row flex-col mt-20 lg:mt-0">
        <div
          className="w-full lg:w-1/2 h-[600px] hidden  bg-no-repeat lg:flex items-center"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        >
          <CustomQnAHeading />
        </div>

        <div className="w-full lg:w-1/2 h-[600px]flex items-center lg:hidden">
          <CustomQnAHeading />
        </div>

        <div className="w-full lg:w-1/2 space-y-4 flex flex-col justify-center">
          {faqData.map((item, index) => (
            <motion.div
            key={index}
              initial={{
                opacity: 0,
                y: 15,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{
                once: true,
                amount: 0.3,
              }}
            >
              <Accordion type="single" collapsible key={index}>
                <AccordionItem value={`item-${index + 1}`}>
                  <AccordionTrigger className="text-left lg:text-center">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
