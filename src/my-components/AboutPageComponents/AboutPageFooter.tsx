import bg_video from "@/assets/images/bg-footerv2.mp4";



export const AboutPageFooter = () => {
  return (
    <section className="relative w-full h-[400px] overflow-hidden">
      <video
        src={bg_video}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      ></video>
      <div className="absolute top-0 left-0 w-full h-full bg-violet-950/90"></div>
      <h1>test</h1>
    </section>
  );
};
