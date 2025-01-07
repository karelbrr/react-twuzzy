const NoChatSelected = () => {
  return (
    <section className="h-[80%] w-[82%] flex justify-center">
      <div className="w-1/2 opacity-70 mt-5">
        <h2 className="text-center text-xl font-medium ">No Chat Selected</h2>
        <p className="text-justify opacity-65">
          Welcome! Please select a chat from the sidebar to start a
          conversation. If you don’t see any chats, try creating a new one or
          connecting with someone to begin chatting! 😊
        </p>
      </div>
    </section>
  );
};

export default NoChatSelected;
