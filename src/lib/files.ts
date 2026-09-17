"use client";

import type { ApiAttachment } from "@/lib/api-types";

export const MAX_ATTACHMENT_BYTES = 1.5 * 1024 * 1024;
export const RESULT_ATTACHMENT_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/webp"];

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("We couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

/** Report sheets: PDF or image, size-capped. */
export async function fileToAttachment(file: File): Promise<ApiAttachment> {
  if (!RESULT_ATTACHMENT_TYPES.includes(file.type)) throw new Error("Upload a PDF, PNG, JPG or WEBP file.");
  if (file.size > MAX_ATTACHMENT_BYTES) throw new Error("That file is larger than 1.5 MB. Please compress it first.");
  return { file_name: file.name, mime_type: file.type, data_url: await readAsDataUrl(file) };
}

/** Profile photos are downscaled to a 480px square-ish JPEG before storing. */
export async function imageToDataUrl(file: File, maxSize = 480): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file.");
  const source = await readAsDataUrl(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("That image couldn't be opened."));
    el.src = source;
  });
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

/** Opens a data-URL attachment in a new tab (browsers block top-level data: navigation). */
export function openAttachment(attachment: ApiAttachment) {
  const [meta, b64] = attachment.data_url.split(",");
  const bytes = Uint8Array.from(atob(b64 ?? ""), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes], { type: meta?.match(/data:(.*?);/)?.[1] ?? attachment.mime_type });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
