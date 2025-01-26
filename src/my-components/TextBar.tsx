import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Send, Image, Laugh } from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "./createClient";
import { useParams } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";

interface FormData {
  message: string;
  chat_id: string;
  user_id: string;
  media_url: string;
  is_liked: boolean;
  is_read: boolean;
  replied_to: string;
}

export const TextBar = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { id } = useParams();
  const { user } = useAuth();

  const onSubmit = async (data: FormData) => {
    try {
      const { data: insertedData, error } = await supabase
        .from("messages") 
        .insert([
          {
            chat_id: id,
            user_id: user?.id,
            message: data.message,
            media_url: "",
            is_read: false,
            is_liked: false,
            replied_to: "",
          },
        ]);

      if (error) {
        throw error;
      }

      

      reset({message: ""})
    } catch (error) {
      console.error("Error inserting message:", error);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="h-[4%] border-t fixed right-0 w-[82%] bg-background"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex space-x-3 justify-end pr-10 bg-background"
      >
        <Input
          {...register("message", { required: true })}
          className="mt-10 w-3/4 text-md"
          placeholder="Type your message here..."
        />
        <Button className="mt-10" variant="outline">
          <Image />
        </Button>
        <Button className="mt-10" variant="outline">
          <Laugh />
        </Button>

        <Button className="mt-10" type="submit">
          <Send />
        </Button>
      </form>
    </motion.section>
  );
};
