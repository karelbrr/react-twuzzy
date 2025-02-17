import { motion } from "framer-motion";


export function CustomQnAHeading({}) {
  const mainText = "Everything you need to know is answered here.".split(" ");
  return (
    <motion.h2
      className="m-auto text-5xl lg:text-7xl bg-black/20 pb-14 lg:pb-0  py-2 leading-none text-left font-semibold relative"
    >
      {mainText.map((el, i) => (
        <motion.span
          key={i}
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
            delay: i * 0.05,
            ease: "easeOut",
          }}
          viewport={{
            once: true,
            amount: 0.3,
          }}
          className="inline-block mr-2"
        >
          {i === mainText.length - 1 ? (
            <strong className="font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {el}
            </strong>
          ) : (
            el
          )}
        </motion.span>
      ))}
    </motion.h2>
  );
}
