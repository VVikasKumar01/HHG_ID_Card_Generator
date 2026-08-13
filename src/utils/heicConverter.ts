import heic2any from "heic2any";

/**
 * Converts HEIC/HEIF files to JPEG blobs, or returns standard image files directly.
 */
export async function processImageFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();
  const isHeic = fileName.endsWith(".heic") || fileName.endsWith(".heif") || file.type === "image/heic" || file.type === "image/heif";

  if (isHeic) {
    try {
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });

      const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(blobToUse);
      });
    } catch (err) {
      console.warn("HEIC conversion failed, falling back to FileReader:", err);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
