import { useState, useRef, useEffect, useCallback } from "react";

// ─── tipos ────────────────────────────────────────────────────────────────────
export interface Track {
  id: number;
  title: string;
  album: string;
  year: number;
  duration: string; // "m:ss"
  durationSec: number;
  src: string;   // Caminho em /public/musicas/
  cover: string; // Caminho em /public/capas/
}

// ─── catálogo completo (Bruno Mars) ──────────────────────────────────────────
//
//  COMO ADICIONAR AS MÚSICAS:
//  1. Coloque os arquivos .mp3 dentro de  public/musicas/
//  2. Coloque as capas .jpg/.png dentro de  public/capas/
//  3. O campo "src"   deve ser o nome exato do arquivo em public/musicas/
//  4. O campo "cover" deve ser o nome exato da imagem  em public/capas/
//
//  Exemplo:
//    src:   "/musicas/just_the_way_you_are.mp3"
//    cover: "/capas/doo_wops.jpg"
//
const TRACKS: Track[] = [
  // ── Doo-Wops & Hooligans (2010) ────────────────────────────────────────────
  { id:  1, title: "Grenade",                        album: "Doo-Wops & Hooligans",        year: 2010, duration: "3:42", durationSec: 222, src: "/musicas/grenade.mp3",                        cover: "/capas/doo_wops.jpg" },
  { id:  2, title: "Just the Way You Are",           album: "Doo-Wops & Hooligans",        year: 2010, duration: "3:40", durationSec: 220, src: "/musicas/just_the_way_you_are.mp3",           cover: "/capas/doo_wops.jpg" },
  { id:  3, title: "The Lazy Song",                  album: "Doo-Wops & Hooligans",        year: 2011, duration: "3:09", durationSec: 189, src: "/musicas/the_lazy_song.mp3",                  cover: "/capas/doo_wops.jpg" },
  { id:  4, title: "Marry You",                      album: "Doo-Wops & Hooligans",        year: 2010, duration: "3:51", durationSec: 231, src: "/musicas/marry_you.mp3",                      cover: "/capas/doo_wops.jpg" },
  { id:  5, title: "Count on Me",                    album: "Doo-Wops & Hooligans",        year: 2010, duration: "3:18", durationSec: 198, src: "/musicas/count_on_me.mp3",                    cover: "/capas/doo_wops.jpg" },
  { id:  6, title: "Talking to the Moon",            album: "Doo-Wops & Hooligans",        year: 2010, duration: "3:35", durationSec: 215, src: "/musicas/talking_to_the_moon.mp3",            cover: "/capas/doo_wops.jpg" },
  { id:  7, title: "Runaway Baby",                   album: "Doo-Wops & Hooligans",        year: 2010, duration: "2:59", durationSec: 179, src: "/musicas/runaway_baby.mp3",                   cover: "/capas/doo_wops.jpg" },
  { id:  8, title: "The Other Side",                 album: "Doo-Wops & Hooligans",        year: 2010, duration: "3:14", durationSec: 194, src: "/musicas/the_other_side.mp3",                 cover: "/capas/doo_wops.jpg" },
  { id:  9, title: "Liquor Store Blues",             album: "Doo-Wops & Hooligans",        year: 2010, duration: "3:52", durationSec: 232, src: "/musicas/liquor_store_blues.mp3",             cover: "/capas/doo_wops.jpg" },
  { id: 10, title: "Freak",                          album: "Doo-Wops & Hooligans",        year: 2010, duration: "3:25", durationSec: 205, src: "/musicas/freak.mp3",                          cover: "/capas/doo_wops.jpg" },
  { id: 11, title: "It Will Rain",                   album: "Doo-Wops & Hooligans",        year: 2011, duration: "4:09", durationSec: 249, src: "/musicas/it_will_rain.mp3",                   cover: "/capas/doo_wops.jpg" },

  // ── Unorthodox Jukebox (2012) ──────────────────────────────────────────────
  { id: 12, title: "Young Girls",                    album: "Unorthodox Jukebox",          year: 2012, duration: "4:04", durationSec: 244, src: "/musicas/young_girls.mp3",                    cover: "/capas/unorthodox_jukebox.jpg" },
  { id: 13, title: "Locked Out of Heaven",           album: "Unorthodox Jukebox",          year: 2012, duration: "3:53", durationSec: 233, src: "/musicas/locked_out_of_heaven.mp3",           cover: "/capas/unorthodox_jukebox.jpg" },
  { id: 14, title: "Gorilla",                        album: "Unorthodox Jukebox",          year: 2012, duration: "4:02", durationSec: 242, src: "/musicas/gorilla.mp3",                        cover: "/capas/unorthodox_jukebox.jpg" },
  { id: 15, title: "Treasure",                       album: "Unorthodox Jukebox",          year: 2013, duration: "2:59", durationSec: 179, src: "/musicas/treasure.mp3",                       cover: "/capas/unorthodox_jukebox.jpg" },
  { id: 16, title: "Moonshine",                      album: "Unorthodox Jukebox",          year: 2012, duration: "3:47", durationSec: 227, src: "/musicas/moonshine.mp3",                      cover: "/capas/unorthodox_jukebox.jpg" },
  { id: 17, title: "When I Was Your Man",            album: "Unorthodox Jukebox",          year: 2013, duration: "3:33", durationSec: 213, src: "/musicas/when_i_was_your_man.mp3",            cover: "/capas/unorthodox_jukebox.jpg" },
  { id: 18, title: "Natalie",                        album: "Unorthodox Jukebox",          year: 2012, duration: "3:45", durationSec: 225, src: "/musicas/natalie.mp3",                        cover: "/capas/unorthodox_jukebox.jpg" },
  { id: 19, title: "Show Me",                        album: "Unorthodox Jukebox",          year: 2012, duration: "3:14", durationSec: 194, src: "/musicas/show_me.mp3",                        cover: "/capas/unorthodox_jukebox.jpg" },
  { id: 20, title: "Money Make Her Smile",           album: "Unorthodox Jukebox",          year: 2012, duration: "3:27", durationSec: 207, src: "/musicas/money_make_her_smile.mp3",           cover: "/capas/unorthodox_jukebox.jpg" },
  { id: 21, title: "If I Knew",                      album: "Unorthodox Jukebox",          year: 2012, duration: "4:09", durationSec: 249, src: "/musicas/if_i_knew.mp3",                      cover: "/capas/unorthodox_jukebox.jpg" },

  // ── Singles avulsos ───────────────────────────────────────────────────────
  { id: 22, title: "Uptown Funk (ft. Bruno Mars)",   album: "Singles",                     year: 2014, duration: "4:30", durationSec: 270, src: "/musicas/uptown_funk.mp3",                    cover: "/capas/singles.jpg" },
  { id: 23, title: "That's What I Like",             album: "Singles",                     year: 2016, duration: "3:28", durationSec: 208, src: "/musicas/thats_what_i_like_single.mp3",       cover: "/capas/singles.jpg" },

  // ── 24K Magic (2016) ──────────────────────────────────────────────────────
  { id: 24, title: "24K Magic",                      album: "24K Magic",                   year: 2016, duration: "3:46", durationSec: 226, src: "/musicas/24k_magic.mp3",                      cover: "/capas/24k_magic.jpg" },
  { id: 25, title: "Chunky",                         album: "24K Magic",                   year: 2016, duration: "3:12", durationSec: 192, src: "/musicas/chunky.mp3",                         cover: "/capas/24k_magic.jpg" },
  { id: 26, title: "Perm",                           album: "24K Magic",                   year: 2016, duration: "3:37", durationSec: 217, src: "/musicas/perm.mp3",                           cover: "/capas/24k_magic.jpg" },
  { id: 27, title: "That's What I Like",             album: "24K Magic",                   year: 2017, duration: "3:28", durationSec: 208, src: "/musicas/thats_what_i_like.mp3",              cover: "/capas/24k_magic.jpg" },
  { id: 28, title: "Straight Up & Down",             album: "24K Magic",                   year: 2016, duration: "3:38", durationSec: 218, src: "/musicas/straight_up_and_down.mp3",           cover: "/capas/24k_magic.jpg" },
  { id: 29, title: "Versace on the Floor",           album: "24K Magic",                   year: 2017, duration: "4:14", durationSec: 254, src: "/musicas/versace_on_the_floor.mp3",           cover: "/capas/24k_magic.jpg" },
  { id: 30, title: "Calling All My Lovelies",        album: "24K Magic",                   year: 2016, duration: "3:43", durationSec: 223, src: "/musicas/calling_all_my_lovelies.mp3",        cover: "/capas/24k_magic.jpg" },
  { id: 31, title: "Finesse",                        album: "24K Magic",                   year: 2017, duration: "3:26", durationSec: 206, src: "/musicas/finesse.mp3",                        cover: "/capas/24k_magic.jpg" },
  { id: 32, title: "Too Good to Say Goodbye",        album: "24K Magic",                   year: 2017, duration: "4:02", durationSec: 242, src: "/musicas/too_good_to_say_goodbye.mp3",        cover: "/capas/24k_magic.jpg" },

  // ── An Evening with Silk Sonic (2021) ─────────────────────────────────────
  { id: 33, title: "Leave the Door Open",            album: "An Evening with Silk Sonic",  year: 2021, duration: "4:02", durationSec: 242, src: "/musicas/leave_the_door_open.mp3",            cover: "/capas/silk_sonic.jpg" },
  { id: 34, title: "Fly as Me",                      album: "An Evening with Silk Sonic",  year: 2021, duration: "2:34", durationSec: 154, src: "/musicas/fly_as_me.mp3",                      cover: "/capas/silk_sonic.jpg" },
  { id: 35, title: "After Last Night",               album: "An Evening with Silk Sonic",  year: 2021, duration: "3:23", durationSec: 203, src: "/musicas/after_last_night.mp3",               cover: "/capas/silk_sonic.jpg" },
  { id: 36, title: "Smokin Out the Window",          album: "An Evening with Silk Sonic",  year: 2021, duration: "3:38", durationSec: 218, src: "/musicas/smokin_out_the_window.mp3",          cover: "/capas/silk_sonic.jpg" },
  { id: 37, title: "Put On a Smile",                 album: "An Evening with Silk Sonic",  year: 2021, duration: "4:09", durationSec: 249, src: "/musicas/put_on_a_smile.mp3",                 cover: "/capas/silk_sonic.jpg" },
  { id: 38, title: "Skate",                          album: "An Evening with Silk Sonic",  year: 2021, duration: "3:28", durationSec: 208, src: "/musicas/skate.mp3",                          cover: "/capas/silk_sonic.jpg" },
  { id: 39, title: "777",                            album: "An Evening with Silk Sonic",  year: 2021, duration: "2:58", durationSec: 178, src: "/musicas/777.mp3",                            cover: "/capas/silk_sonic.jpg" },
  { id: 40, title: "Blast Off",                      album: "An Evening with Silk Sonic",  year: 2021, duration: "4:29", durationSec: 269, src: "/musicas/blast_off.mp3",                      cover: "/capas/silk_sonic.jpg" },
];

// ─── paleta de cores dos álbuns ───────────────────────────────────────────────
const ALBUM_COLORS: Record<string, string> = {
  "Doo-Wops & Hooligans":       "#e06c3f",
  "Unorthodox Jukebox":         "#c0392b",
  "Singles":                    "#8e44ad",
  "24K Magic":                  "#d4ac0d",
  "An Evening with Silk Sonic": "#1a7a5e",
};

function albumColor(album: string) {
  return ALBUM_COLORS[album] ?? "#1db954";
}

// ─── utilitários ──────────────────────────────────────────────────────────────
function fmtSec(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─── ícones SVG leves ─────────────────────────────────────────────────────────
const Ico = {
  play:  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M8 5v14l11-7z"/></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>,
  prev:  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>,
  next:  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>,
  shuffle:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>,
  repeat:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>,
  heart: <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
  vol:   <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>,
  music: <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
  menu:  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>,
};

// ─── componente principal ─────────────────────────────────────────────────────
type Props = { onClose?: () => void };

export default function SpotifyPlayer({ onClose }: Props) {
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [playing, setPlaying]     = useState(false);
  const [progress, setProgress]   = useState(0);   // 0-1
  const [volume, setVolume]       = useState(0.8);
  const [shuffle, setShuffle]     = useState(false);
  const [repeat, setRepeat]       = useState(false);
  const [search, setSearch]       = useState("");
  const [liked, setLiked]         = useState<Set<number>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS.find(t => t.id === currentId) ?? null;
  const filtered = TRACKS.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.album.toLowerCase().includes(search.toLowerCase())
  );

  // ── áudio: trocar src quando currentId muda ──────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    audio.src = currentTrack.src;
    setProgress(0);
    if (playing) audio.play().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    playing ? audio.play().catch(() => {}) : audio.pause();
  }, [playing]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ── progresso ────────────────────────────────────────────────────────────
  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setProgress(a.currentTime / a.duration);
  };

  // ── próxima faixa ─────────────────────────────────────────────────────────
  const playNext = useCallback(() => {
    if (!TRACKS.length) return;
    if (repeat && currentId !== null) {
      const a = audioRef.current;
      if (a) { a.currentTime = 0; a.play().catch(() => {}); }
      return;
    }
    if (shuffle) {
      const idx = Math.floor(Math.random() * TRACKS.length);
      setCurrentId(TRACKS[idx].id);
    } else {
      const idx = TRACKS.findIndex(t => t.id === currentId);
      const next = TRACKS[(idx + 1) % TRACKS.length];
      setCurrentId(next.id);
    }
    setPlaying(true);
  }, [currentId, shuffle, repeat]);

  const playPrev = () => {
    const idx = TRACKS.findIndex(t => t.id === currentId);
    if (idx <= 0) return;
    setCurrentId(TRACKS[idx - 1].id);
    setPlaying(true);
  };

  const onEnded = () => playNext();

  // ── seek ──────────────────────────────────────────────────────────────────
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    a.currentTime = ratio * a.duration;
  };

  // ── selecionar faixa ──────────────────────────────────────────────────────
  const selectTrack = (t: Track) => {
    if (t.id === currentId) { setPlaying(p => !p); return; }
    setCurrentId(t.id);
    setPlaying(true);
  };

  const accentColor = currentTrack ? albumColor(currentTrack.album) : "#1db954";
  const coverBg     = `linear-gradient(135deg, ${accentColor}88, #121212)`;

  return (
    <div style={S.root}>
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        preload="auto"
      />

      {/* Backdrop para fechar a barra lateral no celular */}
      {sidebarOpen && (
        <div
          style={S.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── sidebar ── */}
      <aside
        style={{
          ...S.sidebar,
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}
        className="responsive-sidebar"
      >
        <div style={S.sideHeader}>
          <div style={{ ...S.logo, color: accentColor }}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span style={S.logoText}>MusicPlayer</span>
          </div>
          {onClose && (
            <button style={S.closeBtn} onClick={onClose}>{Ico.close}</button>
          )}
        </div>

        <nav style={S.nav}>
          <div style={{ ...S.navItem, ...S.navActive }} onClick={() => setSidebarOpen(false)}>
            🎵 Bruno Mars
          </div>
          <div style={S.navItem} onClick={() => setSidebarOpen(false)}>
            ❤️ Curtidas ({liked.size})
          </div>
        </nav>

        {/* álbuns */}
        <div style={S.albumList}>
          {Object.keys(ALBUM_COLORS).map(alb => (
            <div key={alb} style={S.albumChip}>
              <div style={{ ...S.albumDot, background: albumColor(alb) }} />
              <span style={S.albumName}>{alb}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── main ── */}
      <main style={S.main} className="responsive-main">
        {/* topo */}
        <div style={S.topBar}>
          <button
            className="menu-hamburger-btn"
            style={S.menuBtn}
            onClick={() => setSidebarOpen(true)}
          >
            {Ico.menu}
          </button>
          <input
            style={S.search}
            placeholder="🔍  Buscar música ou álbum..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* cabeçalho do artista */}
        <div style={{ ...S.artistBanner, background: coverBg }} className="responsive-banner">
          <div style={S.artistInfo}>
            <span style={S.artistTag}>ARTISTA VERIFICADO</span>
            <h1 style={S.artistName} className="responsive-artist-name">Bruno Mars</h1>
            <span style={S.trackCount}>{TRACKS.length} músicas</span>
          </div>
        </div>

        {/* tabela */}
        <div style={S.tableHeader}>
          <span style={{ width: 32, textAlign: "center" }}>#</span>
          <span style={{ flex: 2 }}>TÍTULO</span>
          <span className="hide-mobile" style={{ flex: 1.5, display: "flex" as const }}>ÁLBUM</span>
          <span style={{ width: 40, textAlign: "right" as const }}>❤️</span>
          <span style={{ width: 60, textAlign: "right" as const }}>⏱</span>
        </div>

        <div style={S.trackList}>
          {filtered.map((t, i) => {
            const active = t.id === currentId;
            const color  = albumColor(t.album);
            return (
              <div
                key={t.id}
                style={{
                  ...S.trackRow,
                  background: active ? `${color}18` : "transparent",
                  borderLeft: active ? `3px solid ${color}` : "3px solid transparent",
                }}
                onClick={() => selectTrack(t)}
              >
                <span style={{ width: 32, textAlign: "center", color: active ? color : "#b3b3b3", fontWeight: 700 }}>
                  {active && playing ? "▶" : i + 1}
                </span>

                <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{ ...S.miniCover, background: `${color}33` }}>
                    <img
                      src={t.cover}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }}
                      alt=""
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ color: active ? color : "#fff", fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.title}
                    </div>
                    <div style={{ color: "#b3b3b3", fontSize: 12 }}>Bruno Mars</div>
                  </div>
                </div>

                <span className="hide-mobile" style={{ flex: 1.5, color: "#b3b3b3", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.album}
                </span>

                <button
                  style={{ ...S.heartBtn, color: liked.has(t.id) ? "#e91e63" : "#555" }}
                  onClick={e => {
                    e.stopPropagation();
                    setLiked(s => {
                      const ns = new Set(s);
                      ns.has(t.id) ? ns.delete(t.id) : ns.add(t.id);
                      return ns;
                    });
                  }}
                >
                  {Ico.heart}
                </button>

                <span style={{ width: 60, textAlign: "right", color: "#b3b3b3", fontSize: 13 }}>{t.duration}</span>
              </div>
            );
          })}
        </div>
      </main>

      {/* ── player bar ── */}
      <div style={S.playerBar} className="responsive-playerbar">
        {/* info */}
        <div style={S.nowPlaying}>
          <div style={{ ...S.npCover, background: currentTrack ? `${accentColor}33` : "#282828" }}>
            {currentTrack
              ? (
                <img
                  src={currentTrack.cover}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }}
                  alt=""
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )
              : <span style={{ color: accentColor, opacity: 0.3 }}>{Ico.music}</span>
            }
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {currentTrack?.title ?? "—"}
            </div>
            <div style={{ color: "#b3b3b3", fontSize: 12 }}>Bruno Mars</div>
          </div>
          <button
            style={{ ...S.heartBtn, marginLeft: 12, color: currentTrack && liked.has(currentTrack.id) ? "#e91e63" : "#555" }}
            onClick={() => {
              if (!currentTrack) return;
              setLiked(s => {
                const ns = new Set(s);
                ns.has(currentTrack.id) ? ns.delete(currentTrack.id) : ns.add(currentTrack.id);
                return ns;
              });
            }}
          >
            {Ico.heart}
          </button>
        </div>

        {/* controles */}
        <div style={S.controls} className="responsive-controls">
          <div style={S.ctrlBtns}>
            <button className="hide-mobile" style={{ ...S.ctrlBtn, color: shuffle ? accentColor : "#b3b3b3" }} onClick={() => setShuffle(s => !s)}>{Ico.shuffle}</button>
            <button style={S.ctrlBtn} onClick={playPrev}>{Ico.prev}</button>
            <button
              style={{ ...S.playBtn, background: accentColor }}
              onClick={() => {
                if (!currentId && TRACKS.length) {
                  setCurrentId(TRACKS[0].id);
                  setPlaying(true);
                } else {
                  setPlaying(p => !p);
                }
              }}
            >
              {playing ? Ico.pause : Ico.play}
            </button>
            <button style={S.ctrlBtn} onClick={playNext}>{Ico.next}</button>
            <button className="hide-mobile" style={{ ...S.ctrlBtn, color: repeat ? accentColor : "#b3b3b3" }} onClick={() => setRepeat(r => !r)}>{Ico.repeat}</button>
          </div>

          <div style={S.progressRow}>
            <span style={S.timeLabel}>{currentTrack && audioRef.current ? fmtSec(audioRef.current.currentTime) : "0:00"}</span>
            <div style={S.progressBg} onClick={seek}>
              <div style={{ ...S.progressFill, width: `${progress * 100}%`, background: accentColor }} />
              <div style={{ ...S.progressThumb, left: `calc(${progress * 100}% - 6px)`, background: accentColor }} />
            </div>
            <span style={S.timeLabel}>{currentTrack?.duration ?? "0:00"}</span>
          </div>
        </div>

        {/* volume */}
        <div style={S.volArea} className="hide-mobile">
          <span style={{ color: "#b3b3b3" }}>{Ico.vol}</span>
          <input
            type="range" min={0} max={1} step={0.01} value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            style={S.volSlider}
          />
        </div>
      </div>

      {/* ── estilos responsivos ── */}
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: #535353; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #fff; cursor: pointer; }

        @media (max-width: 768px) {
          .responsive-sidebar {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            bottom: 0 !important;
            z-index: 11000 !important;
            width: 260px !important;
            transition: transform 0.3s ease-out !important;
            transform: translateX(-100%);
          }
          .responsive-main {
            margin-left: 0 !important;
            padding-bottom: 110px !important;
          }
          .menu-hamburger-btn {
            display: flex !important;
          }
          .hide-mobile {
            display: none !important;
          }
          .responsive-artist-name {
            font-size: 36px !important;
          }
          .responsive-banner {
            height: 150px !important;
          }
          .responsive-playerbar {
            flex-direction: column !important;
            height: auto !important;
            padding: 10px 16px !important;
            gap: 8px !important;
            bottom: 0 !important;
          }
          .responsive-controls {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── estilos inline ───────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root: {
    position: "fixed", inset: 0, display: "flex", flexDirection: "column",
    background: "#121212", color: "#fff",
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    zIndex: 9999,
  },
  sidebarOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 10500,
  },
  sidebar: {
    position: "absolute", left: 0, top: 0, bottom: 90,
    width: 240, background: "#000",
    display: "flex", flexDirection: "column", padding: "16px 0",
    overflowY: "auto",
  },
  sideHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 16px 16px",
    borderBottom: "1px solid #1a1a1a",
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { fontWeight: 800, fontSize: 16, letterSpacing: "-0.5px" },
  closeBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#b3b3b3", padding: 4, borderRadius: 4,
    display: "flex", alignItems: "center",
  },
  menuBtn: {
    display: "none", background: "none", border: "none", color: "#fff",
    cursor: "pointer", padding: 4, marginRight: 8, alignItems: "center",
  },
  nav: { padding: "12px 0" },
  navItem: { padding: "10px 16px", cursor: "pointer", color: "#b3b3b3", fontSize: 14, fontWeight: 500 },
  navActive: { color: "#fff", background: "#282828", borderLeft: "3px solid #1db954" },
  albumList: { padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 },
  albumChip: { display: "flex", alignItems: "center", gap: 8 },
  albumDot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  albumName: { fontSize: 12, color: "#b3b3b3", lineHeight: 1.3 },

  main: {
    marginLeft: 240, marginBottom: 90,
    overflowY: "auto", flex: 1,
  },
  topBar: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "16px 24px", position: "sticky", top: 0,
    background: "#121212cc", backdropFilter: "blur(8px)", zIndex: 10,
  },
  search: {
    flex: 1, background: "#282828", border: "none", borderRadius: 20,
    padding: "10px 16px", color: "#fff", fontSize: 14, outline: "none",
    minWidth: 60,
  },

  artistBanner: {
    height: 220, display: "flex", alignItems: "flex-end",
    padding: "0 24px 24px", position: "relative", overflow: "hidden",
  },
  artistInfo: { display: "flex", flexDirection: "column", gap: 4 },
  artistTag: { fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: 1 },
  artistName: { fontSize: 72, fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: "-2px" },
  trackCount: { color: "#b3b3b3", fontSize: 14, marginTop: 4 },

  tableHeader: {
    display: "flex", alignItems: "center",
    padding: "8px 24px", borderBottom: "1px solid #282828",
    color: "#b3b3b3", fontSize: 11, fontWeight: 700,
    letterSpacing: 1, textTransform: "uppercase",
    position: "sticky", top: 57, background: "#121212", zIndex: 5,
  },
  trackList: { padding: "8px 0" },
  trackRow: {
    display: "flex", alignItems: "center",
    padding: "8px 24px", cursor: "pointer", transition: "background .15s",
    gap: 0,
  },
  miniCover: {
    width: 40, height: 40, borderRadius: 4, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  heartBtn: {
    background: "none", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", padding: 0,
    width: 40, justifyContent: "center", flexShrink: 0,
  },

  playerBar: {
    position: "fixed", bottom: 0, left: 0, right: 0, height: 90,
    background: "#181818", borderTop: "1px solid #282828",
    display: "flex", alignItems: "center", padding: "0 16px",
    gap: 16, zIndex: 1000,
  },
  nowPlaying: {
    display: "flex", alignItems: "center", gap: 12,
    flex: 1, minWidth: 0,
  },
  npCover: {
    width: 56, height: 56, borderRadius: 6, flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center",
    overflow: "hidden",
  },
  controls: { flex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 0 },
  ctrlBtns: { display: "flex", alignItems: "center", gap: 16 },
  ctrlBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#b3b3b3", display: "flex", alignItems: "center",
    transition: "color .15s",
  },
  playBtn: {
    width: 40, height: 40, borderRadius: "50%", border: "none",
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", color: "#000", flexShrink: 0,
    transition: "transform .1s",
  },
  progressRow: { display: "flex", alignItems: "center", gap: 8, width: "100%" },
  timeLabel: { color: "#b3b3b3", fontSize: 11, minWidth: 36, textAlign: "center" },
  progressBg: {
    flex: 1, height: 4, background: "#535353", borderRadius: 2,
    cursor: "pointer", position: "relative",
  },
  progressFill: { height: "100%", borderRadius: 2, transition: "width .25s linear" },
  progressThumb: {
    position: "absolute", top: -4, width: 12, height: 12,
    borderRadius: "50%", pointerEvents: "none",
  },
  volArea: { display: "flex", alignItems: "center", gap: 8, flex: 1, justifyContent: "flex-end", minWidth: 140 },
  volSlider: { width: 100 },
};