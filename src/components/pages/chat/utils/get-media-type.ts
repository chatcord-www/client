const imageRegex = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
const videoRegex = /\.(mp4|webm|ogg|mov|m4v)$/i;

const isUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
};

export const getMediaType = (value: string) => {
  if (!isUrl(value)) return "text" as const;

  const { pathname } = new URL(value);
  const normalizedPath = decodeURIComponent(pathname).toLowerCase();

  if (imageRegex.test(normalizedPath)) return "image" as const;
  if (videoRegex.test(normalizedPath)) return "video" as const;

  return "text" as const;
};