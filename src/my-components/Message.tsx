import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { formatDate } from "./my-hooks/formatDate";
import { useClipboard } from "./my-hooks/useClipboard";
import { supabase } from "./my-hooks/createClient";
import { AnimatePresence, motion } from "framer-motion";
import useRepliedMessage from "./my-hooks/useRepliedMessage";
import {
  Copy,
  Heart,
  ThumbsDown,
  MessageSquareReply,
  Trash2,
  File,
  AudioLines,
} from "lucide-react";
import { useMediaType } from "./my-hooks/useMediaType";

interface MessageProps {
  position?: string | "left" | "right";
  message: string;
  created_at: string;
  is_liked: boolean;
  id: string;
  replied_to: string;
  media_url: string;
  setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
}

const Message: React.FC<MessageProps> = ({
  position = "left",
  message,
  created_at,
  is_liked,
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

  const mediaType = useMediaType(media_url);
  const filename = media_url?.split("?")[0].split("/").pop();
  const cleanName = filename?.split("_").slice(1).join("_");

  return (
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
          } max-w-[500px] text-base mx-5 mt-1 ${
            position === "right"
              ? " ml-auto" // zpráva vpravo
              : " mr-auto" // zpráva vlevo
          } ${is_liked && "mb-2"} ${replied_to && "mt-8"}`}
        >
          {media_url ? (
            <>
              {mediaType === "image" && media_url && (
                <img className="mt-1 rounded-lg" src={media_url} alt="Media" />
              )}
              {mediaType === "audio" && media_url && (
                <div className="w-full bg-zinc-900 border rounded-xl">
                  <h2 className="ml-4 my-4 flex">
                    <AudioLines className="mr-2" />
                    {cleanName}
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
                    {cleanName}
                  </a>
                </div>
              )}
            </>
          ) : (
            <p>{message}</p>
          )}

          {replied_to && (
            <div
              className={`${
                position === "right"
                  ? "absolute z-50 right-0 top-[-27px] w-[500px] text-right  max-w-[500px] opacity-70 max-h-6 overflow-hidden"
                  : "absolute top-[-27px]  w-[500px] left-0 max-w-[500px] opacity-70 max-h-6 overflow-hidden"
              }`}
            >
              <p>Replying to: {repliedMessage?.message}</p>
            </div>
          )}

          <AnimatePresence>
            {is_liked && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{
                  opacity: 1,
                  y: 0,

                  transition: { duration: 0.3, type: "spring", stiffness: 200 },
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
  );
};

export default Message;
