import { resolveCloudAssetSrc } from "../cloudAssets";
import type { FotoItem } from "./Galeriapainelbase";


// ─────────────────────────────────────────────────────────────────────────────
// Fotos do chat da Mãe (Elena). Troque pelos caminhos reais das fotos —
// mesmo padrão do FOTOS em ChatMae.tsx (arquivos em /public/imagens/mae/...).
// ─────────────────────────────────────────────────────────────────────────────
export const GALERIA_MAE: FotoItem[] = [
  { id: 1, url: resolveCloudAssetSrc("/imagens/mae/foto2.jpg") },
  { id: 2, url: resolveCloudAssetSrc("/imagens/mae/foto3.jpg") },
  { id: 3, url: resolveCloudAssetSrc("/imagens/mae/foto4.jpg") },
];