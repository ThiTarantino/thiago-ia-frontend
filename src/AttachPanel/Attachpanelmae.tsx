import { useState } from "react";
import AttachPanelBase, { type AttachOpcao } from "./AttachPanelBase";
import DocumentosPainelBase from "./Documentospainelbase";
import GaleriaPainelBase from "./Galeriapainelbase";
import { DOCUMENTOS_MAE } from "./Documentosmae";
import { GALERIA_MAE } from "./Galeriamae";


// ─────────────────────────────────────────────────────────────────────────────
// AttachPanelMae — opções do Attach específicas do chat da Mãe (Elena).
//
// Câmera e Áudio foram deixados de fora (conforme combinado, esse chat
// provavelmente não vai ter essas duas funções).
//
// Pra adicionar "Pasta" (pasta secreta com IP+senha próprios), quando tiver
// o PastaSecreta.tsx de referência, é só:
//   1. import PastaSecretaLogin from "./PastaSecretaLogin";
//   2. adicionar um estado showPastaLogin / showPasta
//   3. adicionar uma opção no array abaixo com o ícone de pasta
//   4. renderizar <PastaSecretaLogin ipCorreto="..." senhaCorreta="..." .../>
//      quando showPastaLogin, e o painel de conteúdo quando showPasta
//
// Pra adicionar Contato/Localização, o mesmo princípio: cria o painel de
// conteúdo (ContatosPainelMae / LocalizacaoPainelMae), um estado local pra
// controlar se está aberto, e uma entrada no array de opções.
// ─────────────────────────────────────────────────────────────────────────────

const IconGaleria = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z" />
  </svg>
);

const IconDocumento = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </svg>
);

type Props = { onClose: () => void };

export default function AttachPanelMae({ onClose }: Props) {
  const [showDocumentos, setShowDocumentos] = useState(false);
  const [showGaleria, setShowGaleria] = useState(false);

  if (showDocumentos) {
    return (
      <DocumentosPainelBase
        onClose={() => setShowDocumentos(false)}
        docs={DOCUMENTOS_MAE}
        titulo="Documentos"
      />
    );
  }

  if (showGaleria) {
    return (
      <GaleriaPainelBase
        onClose={() => setShowGaleria(false)}
        fotos={GALERIA_MAE}
        titulo="Fotos e vídeos"
      />
    );
  }

  const opcoes: AttachOpcao[] = [
    {
      label: "Galeria",
      corIcone: "#29b6f6",
      icon: <IconGaleria />,
      onClick: () => setShowGaleria(true),
    },
    {
      label: "Documento",
      corIcone: "#7f66ff",
      icon: <IconDocumento />,
      onClick: () => setShowDocumentos(true),
    },
  ];

  return <AttachPanelBase opcoes={opcoes} onClose={onClose} />;
}