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
import heart from "../assets/images/heart.png";
import { supabase } from "./my-hooks/createClient";
import { AnimatePresence, motion } from "framer-motion";

interface MessageProps {
  position?: string | "left" | "right";
  message: string;
  created_at: string;
  is_liked: boolean;
  id: string;
}

const Message: React.FC<MessageProps> = ({
  position = "left",
  message,
  created_at,
  is_liked,
  id,
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

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, type: "spring", stiffness: 150 },
          }}
          exit={{ opacity: 0, y: 15, transition: { duration: 0.3 } }}
          className={`inline-block relative rounded-xl border px-4 py-2 max-w-[500px] text-base mx-5 mt-1 ${
            position === "right"
              ? "bg-gradient-to-r from-violet-600 to-indigo-500 ml-auto" // zpráva vpravo
              : "bg-gradient-to-r from-violet-600 to-indigo-500 mr-auto" // zpráva vlevo
          } ${is_liked && "mb-2"}`}
        >
          <p>{message}</p>
          <AnimatePresence>
            {is_liked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.3, type: "spring", stiffness: 300 },
                }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.3 } }}
                className="absolute left-2  size-5"
              >
                <img src={heart} alt="heart" />
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
        <ContextMenuItem>Reply</ContextMenuItem>
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
