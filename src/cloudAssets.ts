export const CLOUD_ASSET_BASE = "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev";

export function resolveCloudAssetSrc(src: string) {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }

  if (src.startsWith("/imagens/") || src.startsWith("/videos/") || src.startsWith("/audios/")) {
    return `${CLOUD_ASSET_BASE}${src}`;
  }

  return src;
}
