import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Send,
  Paperclip,
  Laugh,
  Trash2,
  Loader2,
  X,
  Image,
  File,
  AudioLines,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { supabase } from "./my-hooks/createClient";
import { useParams } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import useRepliedMessage from "./my-hooks/useRepliedMessage";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface FormData {
  message: string;
}

interface Props {
  replyingTo: string | null;
  setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
}

export const TextBar = ({ replyingTo, setReplyingTo }: Props) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { id } = useParams();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);

  const sendMessage = async ({
    message,
    file,
  }: {
    message: string;
    file: File | null;
  }) => {
    try {
      const sanitizeFileName = (name: string) => {
        return name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "_");
      };

      const filePath = file
        ? `${id}/${Date.now()}_${sanitizeFileName(file.name)}`
        : "";
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
          message: file ? "media" : message,
          media_url: fileUrl || null,
          is_read: false,
          is_liked: false,
          replied_to: replyingTo,
        },
      ]);

      const { error: updateTimeError } = await supabase
        .from("chats")
        .update({ updated_at: new Date().toISOString() }) 
        .eq("id", id); 

      if (updateTimeError) {
        console.error(
          "Chyba při aktualizaci updated_at:",
          updateTimeError.message
        );
      }

      if (messageError) {
        throw new Error(`Error inserting message: ${messageError.message}`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getCleanNameFromUrl = (media_url: string | undefined): string => {
    if (!media_url) return "";

    const filename = media_url.split("?")[0].split("/").pop();
    return filename?.split("_").slice(1).join("_") || "";
  };

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      reset({ message: "" });
      setFile(null);
      setReplyingTo(null);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate({ message: data.message, file });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log("File selected:", selectedFile); // 👈 Debug
    if (selectedFile) {
      setFile(selectedFile);
      event.target.value = "";
      reset({ message: "" });
    }
  };

  const { data: repliedMessage, error: repliedToError } =
    useRepliedMessage(replyingTo);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      className="h-[4%] lg:h-[8%] xl:h-[4%] border-t fixed right-0 w-[82%] bg-background"
    >
      {file && file.type.startsWith("image/") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          className={`absolute  max-w-[300px]  ${
            repliedMessage ? "bottom-28" : "bottom-12"
          } ml-5`}
        >
          <img
            className={`rounded-xl ${mutation.isPending && "opacity-70"}`}
            src={URL.createObjectURL(file)}
            alt="Preview"
          />
          <Button
            onClick={() => setFile(null)}
            variant="destructive"
            className={`absolute size-8 top-[-10px] right-[-10px] ${
              mutation.isPending && "opacity-70"
            }`}
          >
            <Trash2 />
          </Button>
        </motion.div>
      )}

      {file &&
      !file.type.startsWith("image/") &&
      !file.type.startsWith("audio/") ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          className={`absolute w-[400px] ${
            repliedMessage ? "bottom-28" : "bottom-12"
          } ml-5`}
        >
          <div className="bg-card border rounded-xl p-3 py-5 flex items-center">
            <File className="mr-2" />
            <span className="text-sm">{file.name}</span>
            <Button
              onClick={() => setFile(null)}
              variant="destructive"
              className={`absolute size-8 top-[-10px] right-[-10px] ${
                mutation.isPending && "opacity-70"
              }`}
            >
              <Trash2 />
            </Button>
          </div>
        </motion.div>
      ) : file && file.type.startsWith("audio/") ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          className={`absolute w-[600px]  ${
            repliedMessage ? "bottom-28" : "bottom-12"
          } ml-5`}
        >
          <div className="bg-card border rounded-xl p-3 flex items-center">
            <AudioLines className="mr-2" />
            <span className="text-sm">{file.name}</span>
            <Button
              onClick={() => setFile(null)}
              variant="destructive"
              className={`absolute size-8 top-[-10px] right-[-10px]`}
            >
              <Trash2 />
            </Button>
            <audio controls className="mt-1 w-full bg-card max-w-[400px] ml-10">
              <source src={URL.createObjectURL(file)} type={file.type} />
              Your browser does not support the audio element.
            </audio>
          </div>
        </motion.div>
      ) : null}

      {repliedMessage && (
        <Card className="absolute  max-w-[700px] bottom-12 ml-5 max-h-24 overflow-hidden flex  py-3 pl-3">
          <p className="text-md m-auto opacity-85">
            {repliedToError ? (
              repliedToError.message
            ) : (
              <span className="">
                Replying to:{" "}
                {repliedMessage?.media_url
                  ? getCleanNameFromUrl(repliedMessage.media_url)
                  : repliedMessage?.message}
              </span>
            )}
          </p>
          <Button
            variant={"outline"}
            className="mx-3"
            onClick={() => setReplyingTo(null)}
          >
            <X className="size-5" />
          </Button>
        </Card>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex space-x-3 mt-10 justify-end pr-10 bg-background"
      >
        <Input
          {...register("message", { required: !file })}
          className=" w-3/4 text-md"
          placeholder="Type your message here..."
          disabled={!!file}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Paperclip />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-36">
            <div className="space-y-2">
              <Label
                htmlFor="image-upload"
                className="flex items-center cursor-pointer gap-2 border p-2 hover:bg-zinc-800 transition rounded-lg"
              >
                <Image className="size-4" />
                Image
                <Input
                  id="image-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".png, .jpg, .jpeg"
                />
              </Label>

              <Label
                htmlFor="file-upload"
                className="flex items-center cursor-pointer gap-2 border p-2 hover:bg-zinc-800 transition rounded-lg"
              >
                <File className="size-4" />
                File
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.txt,.mp3"
                />
              </Label>
            </div>
          </PopoverContent>
        </Popover>

        <Button className="" variant="outline">
          <Laugh />
        </Button>
        <Button className="" type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </form>
    </motion.section>
  );
};
