import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Send, Paperclip, Laugh, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "./my-hooks/createClient";
import { useParams } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";

interface FormData {
  message: string;
}

export const TextBar = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { id } = useParams();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const sendMessage = async ({ message, file }: { message: string; file: File | null }) => {
    try {
      
      const filePath = file ? `${id}/${Date.now()}_${file.name}` : "";
      let fileUrl = "";

      if (file) {
        const { error: fileError } = await supabase.storage
          .from("images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (fileError) {
          throw new Error(`Upload failed: ${fileError.message}`);
        }

        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from("images")
          .createSignedUrl(filePath, 31_536_000);

        if (urlError) {
          throw new Error(`Failed to get signed URL: ${urlError.message}`);
        }

        fileUrl = signedUrlData.signedUrl;
      }

      const { error: messageError } = await supabase.from("messages").insert([
        {
          chat_id: id,
          user_id: user?.id,
          message: file ? "image" : message,
          media_url: fileUrl || null,
          is_read: false,
          is_liked: false,
          replied_to: "",
        },
      ]);

      if (messageError) {
        throw new Error(`Error inserting message: ${messageError.message}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      reset({ message: "" });
      setFile(null);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ message: data.message, file });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      reset({ message: "" });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="h-[4%] border-t fixed right-0 w-[82%] bg-background"
    >
      {file && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          className="absolute max-w-[300px] bottom-12 ml-5 "
        >
          <img
            className="rounded-xl"
            src={URL.createObjectURL(file)}
            alt="Preview"
          />
          <Button
            onClick={() => setFile(null)}
            variant="destructive"
            className="absolute size-8 top-[-10px] right-[-10px]"
          >
            <Trash2 />
          </Button>
        </motion.div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex space-x-3 justify-end pr-10 bg-background"
      >
        <Input
          {...register("message", { required: !file })}
          className="mt-10 w-3/4 text-md"
          placeholder="Type your message here..."
          disabled={!!file}
        />
        <div className="mt-10 border flex justify-center items-center px-3 rounded-lg hover:bg-secondary ">
          <Label htmlFor="file-upload" className="hover:cursor-pointer">
            <Paperclip className="size-4" />
          </Label>
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <Button className="mt-10" variant="outline">
          <Laugh />
        </Button>
        <Button className="mt-10" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin"/> : <Send  />}
        </Button>
      </form>
    </motion.section>
  );
};
