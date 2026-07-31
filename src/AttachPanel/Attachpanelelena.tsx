import { useState } from "react";
import AttachPanelBase, { type AttachOpcao } from "./AttachPanelBase";
import PixPainelBase from "./PixPainelBase";
import { DOCUMENTOS_MAE } from "./Documentoselena";
import { PIX_TRANSACOES_MAE, PIX_INDICE_COMPROVANTE_MAE, PIX_COMPROVANTE_MAE } from "./pixElena";
import DocumentosPainelBase from "./Documentospainelbase";
import GaleriaPainelBase from "./Galeriapainelbase";
import { GALERIA_MAE } from "./Galeriaelena";
import PedidosPainelBase from "./PedidosPainelBase";
import { PEDIDOS_MAE } from "./Pedidosmae";

// ─────────────────────────────────────────────────────────────────────────────
// AttachPanelMae — opções do Attach específicas do chat da Mãe (Elena).
//
// Pra adicionar Contato/Localização, o mesmo princípio dos outros: cria o
// painel de conteúdo, um estado local pra controlar se está aberto, e uma
// entrada no array de opções lá embaixo.
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


const IconPix = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7l4.2 4.2a1.13 1.13 0 0 0 1.6 0L17 7" />
    <path d="M7 17l4.2-4.2a1.13 1.13 0 0 1 1.6 0L17 17" />
  </svg>
);

const IconPedidos = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
  </svg>
);


type Props = { onClose: () => void };

export default function AttachPanelMae({ onClose }: Props) {
  const [showDocumentos, setShowDocumentos] = useState(false);
  const [showGaleria, setShowGaleria] = useState(false);
  const [showPix, setShowPix] = useState(false);
  const [showPedidos, setShowPedidos] = useState(false);


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


  if (showPix) {
    return (
      <PixPainelBase
        onClose={() => setShowPix(false)}
        transacoes={PIX_TRANSACOES_MAE}
        indiceComprovante={PIX_INDICE_COMPROVANTE_MAE}
        comprovante={PIX_COMPROVANTE_MAE}
      />
    );
  }

  if (showPedidos) {
    return (
      <PedidosPainelBase
        onClose={() => setShowPedidos(false)}
        itens={PEDIDOS_MAE}
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
   
    {
      label: "Pix",
      corIcone: "#32bcad",
      icon: <IconPix />,
      onClick: () => setShowPix(true),
    },
    {
      label: "Pedidos",
      corIcone: "#f77f00",
      icon: <IconPedidos />,
      onClick: () => setShowPedidos(true),
    },
    
  ];

  return <AttachPanelBase opcoes={opcoes} onClose={onClose} />;
}