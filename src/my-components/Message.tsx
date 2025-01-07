import React from "react";

interface MessageProps {
  position?: "left" | "right"; 
  message: string;
}

const Message: React.FC<MessageProps> = ({ position = "left", message }) => {
  return (
    <div
      className={`inline-block rounded-xl border px-4 py-2 text-base mx-5 mt-1 ${
        position === "right" 
          ? "bg-gradient-to-r from-violet-600 to-indigo-600 ml-auto" // zpráva vpravo
          : "bg-gradient-to-r from-fuchsia-600 to-purple-600 mr-auto"// zpráva vlevo
      }`}
    >
      <p>{message}</p>
    </div>
  );
};

export default Message;
