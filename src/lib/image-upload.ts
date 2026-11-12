import { MAX_ASSET_BYTES, ThemeAsset, validAsset } from "./theme";
export async function readImage(file: File): Promise<ThemeAsset> {
  if (
    !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
  )
    throw new Error(
      "Choose a JPG, PNG, WebP or GIF. SVG and other formats are not accepted.",
    );
  if (file.size > MAX_ASSET_BYTES)
    throw new Error("That image is too big. Maximum file size: 512 KB.");
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(file);
  });
  const dimensions = await new Promise<{ width: number; height: number }>(
    (resolve, reject) => {
      const image = new Image();
      image.onload = () =>
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () =>
        reject(new Error("That file is not a decodable image."));
      image.src = dataUrl;
    },
  );
  if (dimensions.width > 4096 || dimensions.height > 4096)
    throw new Error("Images must be 4096 × 4096 pixels or smaller.");
  const asset = validAsset({
    dataUrl,
    mime: file.type,
    bytes: file.size,
    ...dimensions,
    animated: false,
  });
  if (!asset)
    throw new Error("The file contents do not match a supported raster image.");
  return asset;
}
