import "server-only";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { ApiError } from "@/lib/api";

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

function getExtension(type: string) {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return null;
  }
}

export async function saveImageFile(file: File) {
  if (!allowedMimeTypes.has(file.type)) {
    throw new ApiError(415, "Sube una imagen JPG, PNG, WEBP o GIF.");
  }

  const extension = getExtension(file.type);
  if (!extension) {
    throw new ApiError(415, "Tipo de imagen no soportado.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${randomUUID()}.${extension}`;
  const targetDirectory = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(targetDirectory, { recursive: true });
  await fs.writeFile(path.join(targetDirectory, filename), bytes);

  return `/uploads/${filename}`;
}
