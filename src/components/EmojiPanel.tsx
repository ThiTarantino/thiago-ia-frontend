import { useState} from "react";

const EMOJI_TABS = [
  { icon: "🕐", label: "Recentes" },
  { icon: "😀", label: "Smileys" },
  { icon: "🐶", label: "Animais" },
  { icon: "🍕", label: "Comida" },
  { icon: "⚽", label: "Atividades" },
  { icon: "✈️", label: "Viagens" },
  { icon: "💡", label: "Objetos" },
  { icon: "❤️", label: "Símbolos" },
];

const EMOJIS: string[][] = [
  ["😂","❤️","🥰","😍","😭","🙏","😘","🥺","😊","🔥","💯","🎉","💚","🤣","✨","😅","🤔","😎","🥳","💕"],
  ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺️","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥸","😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻"],
  ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🦟","🦗","🕷️","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆"],
  ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🌽","🥕","🧄","🧅","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🌭","🍔","🍟","🍕","🥪","🥙","🧆","🌮","🌯","🥗","🥘","🍝","🍜"],
  ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🏓","🏸","🏒","🥅","⛳","🎿","🛷","🥌","🎯","🎮","🕹️","🎰","🎲","🧩","♟️","🎭","🎨","🖼️","🎪","🎤","🎧","🎼","🎵","🎶","🎸","🎹","🥁","🎷","🎺"],
  ["🚗","🚕","🚙","🚌","🏎️","🚓","🚑","🚒","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🚁","🛸","✈️","🛩️","🚀","⛵","🚤","🛥️","🚢","⚓","🚉","🚊","🚝","🚞","🗺️","🧭","🏔️","⛰️","🌋","🏕️","🏖️","🏜️","🏝️","🏠","🏢","🏦","🏨","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️"],
  ["⌚","📱","💻","⌨️","🖥️","🖨️","🖱️","💽","💾","💿","📷","📸","📹","🎥","📞","☎️","📺","📻","🧭","⏰","📡","🔋","🔌","💡","🔦","🕯️","🛢️","💰","💵","💸","💳","💹","📈","📉","📊","📋","🗒️","📆","📅","📇","📁","📂","🗂️","🗃️","🗄️","🗑️","🔒","🔓","🔑","🗝️","🔨","🪓","⛏️","⚒️","🛠️","🗡️","⚔️","🛡️","🪚","🔧","🪛","🔩","⚙️","🗜️","🔗","⛓️","🪝","🧲","🔫"],
  ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉️","☸️","✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","✨","⭐","🌟","💫","⚡","☄️","💥","🔥","🌈","☀️","🌤️","⛅","🌦️","🌧️","⛈️","🌩️","🌨️","❄️","☃️","⛄"],
];

type Props = {
  onSelect: (emoji: string) => void;
};

export default function EmojiPanel({ onSelect }: Props) {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");

  const displayed = search
    ? EMOJIS.flat().filter(e => e.includes(search))
    : EMOJIS[tab];

  return (
    <div className="ep-panel">
      <div className="ep-search">
        <input
          placeholder="Pesquisar emoji"
          value={search}
          onChange={e => { setSearch(e.target.value); setTab(0); }}
          autoFocus
        />
      </div>

      {!search && (
        <div className="ep-tabs">
          {EMOJI_TABS.map((t, i) => (
            <button
              key={i}
              className={`ep-tab ${tab === i ? "active" : ""}`}
              onClick={() => setTab(i)}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
        </div>
      )}

      <div className="ep-grid">
        {displayed.map((emoji, i) => (
          <button key={i} className="ep-item" onClick={() => onSelect(emoji)}>
            {emoji}
          </button>
        ))}
      </div>

      <style>{`
        .ep-panel {
          position: absolute; bottom: 62px; left: 0; right: 0; z-index: 51;
          background: #1f2c34; border-top: 1px solid #2a3942;
          display: flex; flex-direction: column; height: 340px;
          animation: panelUp 0.22s cubic-bezier(.2,.8,.3,1);
        }
        @keyframes panelUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .ep-search {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 14px 8px; flex-shrink: 0;
        }
        .ep-search input {
          flex: 1; background: #2a3942; border: none; border-radius: 20px;
          color: #e9edef; font-size: 14px; padding: 7px 14px; outline: none;
          caret-color: #00a884;
        }
        .ep-search input::placeholder { color: #8696a0; }
        .ep-tabs {
          display: flex; border-bottom: 1px solid #2a3942; flex-shrink: 0;
          overflow-x: auto; scrollbar-width: none;
        }
        .ep-tabs::-webkit-scrollbar { display: none; }
        .ep-tab {
          flex: 1; min-width: 40px; padding: 8px 4px; background: none; border: none;
          font-size: 18px; cursor: pointer; border-bottom: 2px solid transparent;
          transition: border-color 0.15s; display: flex; align-items: center; justify-content: center;
        }
        .ep-tab.active { border-bottom-color: #00a884; }
        .ep-grid {
          flex: 1; overflow-y: auto; padding: 8px 6px;
          display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px;
          scrollbar-width: thin; scrollbar-color: #2a3942 transparent;
        }
        .ep-grid::-webkit-scrollbar { width: 4px; }
        .ep-grid::-webkit-scrollbar-thumb { background: #2a3942; border-radius: 2px; }
        .ep-item {
          font-size: 24px; padding: 6px 2px; border-radius: 8px; cursor: pointer;
          transition: background 0.12s; border: none; background: none; line-height: 1;
          display: flex; align-items: center; justify-content: center;
        }
        .ep-item:hover  { background: rgba(255,255,255,.08); }
        .ep-item:active { background: rgba(255,255,255,.14); transform: scale(0.9); }
      `}</style>
    </div>
  );
}