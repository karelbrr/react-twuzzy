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

  const { data: repliedMessage, error: repliedToError } = useRepliedMessage(replied_to);


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
            !media_url &&
            "border px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-500"
          } max-w-[500px] text-base mx-5 mt-1 ${
            position === "right"
              ? " ml-auto" // zpráva vpravo
              : " mr-auto" // zpráva vlevo
          } ${is_liked && "mb-2"} ${replied_to && "mt-8"}`}
        >
          {media_url ? (
            <img className="mt-1 rounded-lg" src={media_url} alt="" />
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
          Copy
        </ContextMenuItem>
        {is_liked ? (
          <ContextMenuItem onClick={() => messageOperation(id, false)}>
            Remove Like
          </ContextMenuItem>
        ) : (
          <ContextMenuItem onClick={() => messageOperation(id, true)}>
            Like
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={() => setReplyingTo(id)}>
          Reply
        </ContextMenuItem>
        {position === "right" && (
          <ContextMenuItem className="text-red-500 focus:text-red-600">
            Delete
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Message;
