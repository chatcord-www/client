const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://chatcord-client.vercel.app",
];

const splitOrigins = (value?: string) =>
  value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

export const allowedOrigins = Array.from(
  new Set([
    ...DEFAULT_ALLOWED_ORIGINS,
    ...splitOrigins(process.env.SOCKET_CORS_ORIGINS),
    ...splitOrigins(process.env.CORS_ORIGIN),
    ...splitOrigins(process.env.NEXTAUTH_URL),
  ]),
);