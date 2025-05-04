
export function renderSpotifyEmbed(message: string) {
  const regex =
    /https:\/\/open\.spotify\.com\/(track|album|playlist|artist|episode|show)\/([a-zA-Z0-9]+)(\?[^\s]*)?/;
  const match = message.match(regex);

  if (!match) return null;

  const type = match[1];
  const id = match[2];

  const embedUrl = `https://open.spotify.com/embed/${type}/${id}`;

  return (
    <iframe
      style={{ borderRadius: "12px" }}
      src={embedUrl}
      width="100%"
      height="152"
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  );
}
