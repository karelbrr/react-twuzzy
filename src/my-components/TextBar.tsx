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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          message: file ? "image" : message,
          media_url: fileUrl || null,
          is_read: false,
          is_liked: false,
          replied_to: replyingTo,
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
      setReplyingTo(null);
    },
  });

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate({ message: data.message, file });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
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
      {file && (
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

      {repliedMessage && (
        <Card className="absolute  max-w-[700px] bottom-12 ml-5 max-h-24 overflow-hidden flex  py-3 pl-3">
          <p className="text-md m-auto opacity-85">
            <span className="">Replying to:</span> {repliedMessage.message}
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"outline"}>
              <Paperclip />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Media</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {" "}
              <div className="">
                <Label htmlFor="file-upload" className=" flex font-normal">
                  <Image className="size-4 mr-2" /> Image
                </Label>

                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".png, .jpg, .jpeg"
                />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <File />
              File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
