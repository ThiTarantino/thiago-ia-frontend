// ─────────────────────────────────────────────────────────────────────────────
// ChatExemplo — descreve um chat de exemplo (sem IA) mostrado na tela inicial.
// O Thiago 2.0 NÃO usa esse tipo — ele continua sendo o App.tsx original,
// sem nenhuma alteração.
// ─────────────────────────────────────────────────────────────────────────────
export type ChatExemplo = {
  id: string;
  nome: string;
  avatar: string;          // foto de perfil (avatar na lista, no header e na chamada)
  respostasScript: string[]; // respostas prontas, respondidas em sequência (cicla no final)
  chamadaAudio: string;      // arquivo de áudio tocado durante a chamada de áudio
  ultimaMensagem: string;    // prévia mostrada na tela inicial
  horaUltimaMensagem: string;
  fixado?: boolean;          // aparece com o ícone de "fixado" na lista, como no WhatsApp
};
