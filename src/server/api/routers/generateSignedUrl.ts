import { env } from "@/env";
import { publicProcedure } from "@/server/api/trpc";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { isAuthorized } from "../middleware/is-auth";

const s3 = new S3Client({
  region: env.S3_REGION,
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  },
});

const allowedMimeTypes = ["image/", "video/"];
const maxFileSize = 50 * 1024 * 1024;

const sanitizeFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");

export const generateSignedUrl = publicProcedure
  .use(isAuthorized)
  .input(
    z.object({
      fileName: z.string().min(1),
      contentType: z.string().min(1),
      fileSize: z.number().int().positive(),
      channelId: z.string(),
      serverId: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const isAllowedType = allowedMimeTypes.some((type) =>
      input.contentType.startsWith(type),
    );

    if (!isAllowedType) {
      throw new Error("Unsupported file type. Only image/video files are allowed.");
    }

    if (input.fileSize > maxFileSize) {
      throw new Error("File is too large. Max allowed size is 50MB.");
    }

    const safeName = sanitizeFileName(input.fileName);
    const key = [
      "uploads",
      input.serverId,
      input.channelId,
      ctx.session?.user.id,
      `${Date.now()}-${crypto.randomUUID()}-${safeName}`,
    ].join("/");

    const putObject = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
      ContentType: input.contentType,
    });

    const uploadUrl = await getSignedUrl(s3, putObject, { expiresIn: 60 });

    const publicBaseUrl = env.S3_PUBLIC_URL
      ? env.S3_PUBLIC_URL.replace(/\/$/, "")
      : `https://${env.S3_BUCKET_NAME}.s3.${env.S3_REGION}.amazonaws.com`;

    return {
      uploadUrl,
      fileUrl: `${publicBaseUrl}/${key}`,
      key,
      maxFileSize,
    };
  });