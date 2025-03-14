const NoChatSelected = () => {
  return (
    <section className="h-[80%] w-[82%] flex justify-center mt-24">
      <div className="w-1/3 opacity-70 mt-5">
        <h2 className="text-center text-xl font-medium ">No Chat Selected</h2>
        <p className="text-center opacity-65">
          Welcome! Select a chat from the sidebar to start. If none, create or
          connect with someone to begin! 😊
        </p>
      </div>
    </section>
  );
};

export default NoChatSelected;
