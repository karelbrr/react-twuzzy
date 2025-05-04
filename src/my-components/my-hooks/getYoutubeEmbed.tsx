
export function renderYouTubeEmbed(message: string) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = message.match(regex);

  if (!match) return null;

  const videoId = match[1];
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <iframe
      width="500"
      height="315"
      src={embedUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    ></iframe>
  );
}
