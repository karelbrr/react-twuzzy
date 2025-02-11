import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import bg from "@/assets/images/qna-bg-4.png";

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
    <section className="bg-[#010101] h-screen">
      <div className=" w-3/4 m-auto flex">
        <div
          className="w-1/2 h-[600px]  bg-no-repeat flex items-center"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        >
          <h2 className="m-auto text-7xl bg-black/20 py-2 leading-none text-left font-semibold relative">
            Everything you need to know is answered{" "}
            <span className="font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              here.
            </span>
          </h2>
        </div>

        <div className="w-1/2 space-y-4 flex flex-col justify-center">
          {faqData.map((item, index) => (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem value={`item-${index + 1}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};
