import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const AboutPageReviews = () => {
  const reviews = [
    {
      name: "Anna K.",
      review:
        "Twuzzy completely changed the way I communicate! Fast, simple, and secure.",
      rating: 5,
      avatar:
        "https://media.istockphoto.com/id/1278976856/photo/happy-student-girl-at-high-school.jpg?s=612x612&w=0&k=20&c=XiJQHTm-LKgCr0s3hURY0ATGFfMZQH4B8gE6h2TlK4U=",
    },
    {
      name: "Tomáš M.",
      review:
        "Finally, a chat app that’s truly lightning-fast. No lag, just smooth conversations!",
      rating: 5,
      avatar: "https://g.denik.cz/63/6f/jindra-polak_denik-630-16x9.jpg",
    },
    {
      name: "David P.",
      review:
        "Perfect for both work and personal chats. I love the high-quality media sharing!",
      rating: 4,
      avatar:
        "https://static8.depositphotos.com/1028979/1058/i/950/depositphotos_10580841-stock-photo-handsome-smiling-man-isolated-over.jpg",
    },
    {
      name: "Sophia L.",
      review:
        "I love the sleek design and intuitive interface. Makes chatting effortless!",
      rating: 5,
      avatar:
        "https://us.123rf.com/450wm/lipik/lipik1710/lipik171000144/87925721-beautiful-young-woman-in-casual-clothes-girl-with-grey-eyes-posing-for-camera.jpg?ver=6",
    },
    {
      name: "Mark R.",
      review:
        "A solid alternative to mainstream chat apps. Needs a few more features, but great overall!",
      rating: 4,
      avatar:
        "https://as2.ftcdn.net/jpg/00/88/53/89/1000_F_88538986_5Bi4eJ667pocsO3BIlbN4fHKz8yUFSuA.jpg",
    },
  ];

  return (
    <section className="w-3/4 m-auto mb-44">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, amount: 0.1 }}
        className=" m-auto mb-7 lg:mb-14"
      >
        <h2 className="bg-[rgb(1,1,1)] text-5xl text-left lg:w-full lg:text-7xl leading-none font-semibold opacity-70 relative">
          What Our Users Really Love <br className="hidden md:block" />
          About{" "}
          <span className="font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Twuzzy
          </span>
        </h2>
      </motion.div>

      <Carousel
        opts={{
          align: "start",
        }}
        className=" m-auto lg:w-full"
      >
        <CarouselContent>
          {reviews.map((review, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <motion.div initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              viewport={{ once: true, amount: 0.4 }} className="p-1">
                <Card>
                  <CardContent className="flex flex-col items-start aspect-square  justify-center p-6">
                    <div className="flex items-center space-x-5 h-28">
                      <Avatar className="size-20 overflow-hidden opacity-80 relative">
                        <AvatarImage
                          src={review.avatar}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-violet-500/30 mix-blend-multiply"></div>
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <span className="text-3xl font-semibold">
                        {review.name}
                      </span>
                    </div>

                    <p className=" mb-5">{review.review}</p>

                    <div className="flex space-x-2 ">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <Star
                          className="text-violet-500"
                          key={index}
                          size={20}
                          strokeWidth={0.75}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ml-4 lg:ml-0" />
        <CarouselNext className="mr-4 lg:mr-0" />
      </Carousel>
    </section>
  );
};

export default AboutPageReviews;
