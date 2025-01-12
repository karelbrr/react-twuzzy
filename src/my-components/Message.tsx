import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { formatDate } from "./formatDate";
import { useClipboard } from "./useClipboard";
import heart  from "../assets/images/heart.png";

interface MessageProps {
  position?: string | "left" | "right";
  message: string;
  created_at: string;
  is_liked: boolean;
}

const Message: React.FC<MessageProps> = ({
  position = "left",
  message,
  created_at,
  is_liked,
}) => {
  const { copyToClipboard } = useClipboard();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`inline-block rounded-xl border px-4 py-2 max-w-[500px] text-base mx-5 mt-1 ${
            position === "right"
              ? "bg-gradient-to-r from-violet-600 to-indigo-500 ml-auto" // zpráva vpravo
              : "bg-gradient-to-r from-violet-600 to-indigo-500 mr-auto" // zpráva vlevo
          } ${is_liked && "mb-2"}`}
        >
          <p>{message}</p>
          {is_liked && <div className="absolute size-5 "><img src={heart} alt="" /></div>}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>{formatDate(created_at)}</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => copyToClipboard(message)}>
          Copy
        </ContextMenuItem>
        {is_liked ? <ContextMenuItem>Remove Like</ContextMenuItem> : <ContextMenuItem>Like</ContextMenuItem>}
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
