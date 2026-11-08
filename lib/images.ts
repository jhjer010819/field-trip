const MAX_EDGE = 1400;
const JPEG_QUALITY = 0.72;
const MAX_SOURCE_BYTES = 12 * 1024 * 1024;

export function isJpegDataUrl(value: string): boolean {
  return value.startsWith("data:image/jpeg;base64,") && value.length < 1_500_000;
}

export async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("type");
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("size");
  }

  const dataUrl = await readFile(file);
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const jpeg = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  if (!isJpegDataUrl(jpeg)) throw new Error("encode");
  return jpeg;
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("read"));
        return;
      }
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image"));
    image.src = src;
  });
}
