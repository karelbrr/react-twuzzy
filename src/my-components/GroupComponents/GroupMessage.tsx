import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "src/my-components/types.tsx";

import {
  Copy,
  Heart,
  ThumbsDown,
  MessageSquareReply,
  Trash2,
  File,
  AudioLines,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useClipboard } from "../my-hooks/useClipboard";
import { supabase } from "../my-hooks/createClient";
import { getProfileData } from "../my-hooks/getProfileData";
import { useMediaType } from "../my-hooks/useMediaType";
import useRepliedMessage from "../my-hooks/useRepliedMessage";
import { formatDate } from "../my-hooks/formatDate";

interface MessageProps {
  position?: string | "left" | "right";
  message: string;
  created_at: string;
  is_liked: boolean;
  user_id: string;
  id: string;
  replied_to: string;
  media_url: string;
  setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
  liked_by: string[];
}

const GroupMessage: React.FC<MessageProps> = ({
  position = "left",
  message,
  created_at,
  is_liked,
  user_id,
  id,
  replied_to,
  media_url,
  setReplyingTo,
}) => {
  const { copyToClipboard } = useClipboard();

  const messageOperation = async (messageId: string, isLiked: boolean) => {
    try {
      const { data: updateData, error } = await supabase
        .from("messages")
        .update({ is_liked: isLiked })
        .eq("id", messageId);

      if (error) {
        throw error;
      }

      console.log("Message liked successfully:", updateData);
    } catch (error) {
      console.error("Error liking message:", error);
    }
  };

  const { data: repliedMessage, error: repliedToError } =
    useRepliedMessage(replied_to);

  const getCleanNameFromUrl = (media_url: string | undefined): string => {
    if (!media_url) return "";

    const filename = media_url.split("?")[0].split("/").pop();
    return filename?.split("_").slice(1).join("_") || "";
  };

  const mediaType = useMediaType(media_url);

  const isUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const {
    data,
    error: errorQuery,
    isLoading,
  } = useQuery<User, Error>({
    queryKey: ["profileDetailsGroupMessage", user_id],
    queryFn: () => getProfileData(user_id),
  });

  return (
    <div className="flex mt-1 space-x-2 ml-3 mr-5">
      {position === "left" && (
        <div>
          <Link to={`/profile/${user_id}`}>
            <Avatar>
              <AvatarImage
                src={data?.avatar}
                className="object-cover w-full h-full"
              />
              <AvatarFallback>
                {data?.first_name?.substring(0, 1) || ""}
                {data?.last_name?.substring(0, 1) || ""}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      )}
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.3, type: "spring", stiffness: 200 },
            }}
            exit={{ opacity: 0, y: 15, transition: { duration: 0.3 } }}
            className={`inline-block relative rounded-xl ${
              !media_url && "border px-4 py-2  bg-zinc-900"
            } max-w-[500px] text-base  ${
              position === "right" ? " ml-auto" : " mr-auto"
            } ${is_liked && "mb-2"} ${replied_to && "mt-8"}`}
          >
            {media_url ? (
              <>
                {mediaType === "image" && media_url && (
                  <Dialog>
                    <DialogTrigger>
                      <img
                        className="mt-1 rounded-lg"
                        src={media_url ? media_url : message}
                        alt="Media"
                      />
                    </DialogTrigger>

                    <DialogContent className="w-full max-w-6xl h-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {getCleanNameFromUrl(media_url)}
                        </DialogTitle>
                        <DialogDescription>
                          Full view of image
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <img
                          className="mt-1 rounded-lg max-h-[85vh] object-contain"
                          src={media_url}
                          alt="Media"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {mediaType === "audio" && media_url && (
                  <div className="w-full bg-zinc-900 border rounded-xl">
                    <h2 className="ml-4 my-4 flex">
                      <AudioLines className="mr-2" />
                      {getCleanNameFromUrl(media_url)}
                    </h2>
                    <audio controls className="mt-2 w-[300px] m-4">
                      <source src={media_url} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                {mediaType === "file" && media_url && (
                  <div className="bg-zinc-900 border rounded-xl p-3 flex items-center">
                    <File className="mr-2" />
                    <a
                      href={media_url}
                      target="_blank"
                      className="text-sm max-w-[300px] hover:underline"
                    >
                      {getCleanNameFromUrl(media_url)}
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p>
                {isUrl(message) ? (
                  <a
                    href={message}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                  >
                    {message}
                  </a>
                ) : (
                  message
                )}
              </p>
            )}

            {replied_to && (
              <div
                className={`${
                  position === "right"
                    ? "absolute z-50 right-0 top-[-27px] w-[500px] text-right  max-w-[500px] opacity-70 max-h-6 overflow-hidden"
                    : "absolute top-[-27px]  w-[500px] left-0 max-w-[500px] opacity-70 max-h-6 overflow-hidden"
                }`}
              >
                <p>
                  Replying to:{" "}
                  {repliedMessage?.media_url
                    ? getCleanNameFromUrl(repliedMessage.media_url)
                    : repliedMessage?.message}
                </p>
              </div>
            )}

            <AnimatePresence>
              {is_liked && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{
                    opacity: 1,
                    y: 0,

                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200,
                    },
                  }}
                  exit={{ opacity: 0, y: 15, transition: { duration: 0.3 } }}
                  className="absolute left-2 text-xl bottom-[-15px]"
                >
                  ❤️
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>{formatDate(created_at)}</ContextMenuLabel>
          <ContextMenuSeparator />

          <ContextMenuItem onClick={() => copyToClipboard(message)}>
            <Copy className="w-4 h-4 mr-1.5" />
            Copy
          </ContextMenuItem>

          {is_liked ? (
            <ContextMenuItem onClick={() => messageOperation(id, false)}>
              <ThumbsDown className="w-4 h-4 mr-1.5" />
              Remove Like
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={() => messageOperation(id, true)}>
              <Heart className="w-4 h-4 mr-1.5" />
              Like
            </ContextMenuItem>
          )}

          <ContextMenuItem onClick={() => setReplyingTo(id)}>
            <MessageSquareReply className="w-4 h-4 mr-1.5" />
            Reply
          </ContextMenuItem>

          {position === "right" && (
            <div>
              <ContextMenuSeparator />
              <ContextMenuItem className="text-red-700 focus:text-red-700">
                <Trash2 className="w-4 h-4 mr-1.5" />
                Delete
              </ContextMenuItem>
            </div>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export default GroupMessage;
