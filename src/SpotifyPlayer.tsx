import { useState, useRef, useEffect, useCallback } from "react";

export interface Track {
  id: number; title: string; artist: string; album: string;
  duration: string; durationSec: number; src: string; cover: string;
}

const CLOUD_AUDIO_BASE = "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev";

function resolveAudioSrc(src: string) {
  return src.startsWith("/musicas/") ? `${CLOUD_AUDIO_BASE}${src}` : src;
}

function resolveCoverSrc(src: string) {
  return src.startsWith("/capas/") ? `${CLOUD_AUDIO_BASE}${src}` : src;
}

const TRACKS: Track[] = [
  { id:   1, title: "Rock That Body",                              artist: "Black Eyed Peas",                           album: "The E.N.D.",                            duration: "4:32", durationSec: 272, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/rock_that_body.mp3",                              cover: resolveCoverSrc("/capas/black_eyed_peas.jpg") },
  { id:   2, title: "Roxanne",                                     artist: "Arizona Zervas",                            album: "Singles",                               duration: "2:50", durationSec: 170, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/roxanne.mp3",                                     cover: resolveCoverSrc("/capas/arizona_zervas.jpg") },
  { id:   3, title: "Suddenly I See",                              artist: "KT Tunstall",                               album: "Eye to the Telescope",                  duration: "3:19", durationSec: 199, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/suddenly_i_see.mp3",                              cover: resolveCoverSrc("/capas/kt_tunstall.jpg") },
  { id:   4, title: "Suddenly I See (Radio Version)",              artist: "KT Tunstall",                               album: "Eye to the Telescope",                  duration: "3:14", durationSec: 194, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/suddenly_i_see_radio.mp3",                        cover: resolveCoverSrc("/capas/kt_tunstall.jpg") },
  { id:   5, title: "RUNWAY",                                      artist: "Lady Gaga, Doechii",                        album: "Singles",                               duration: "3:10", durationSec: 190, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/runway.mp3",                                      cover: resolveCoverSrc("/capas/lady_gaga.jpg") },
  { id:   6, title: "Anjos",                                       artist: "Venere Vai Venus",                          album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/anjos.mp3",                                       cover: resolveCoverSrc("/capas/venere.jpg") },
  { id:   7, title: "Criminal",                                    artist: "Britney Spears",                            album: "Femme Fatale",                          duration: "3:39", durationSec: 219, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/criminal.mp3",                                    cover: resolveCoverSrc("/capas/britney.jpg") },
  { id:   8, title: "Gimme More",                                  artist: "Britney Spears",                            album: "Blackout",                              duration: "4:12", durationSec: 252, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/gimme_more.mp3",                                  cover: resolveCoverSrc("/capas/britney.jpg") },
  { id:   9, title: "White Keys",                                  artist: "Dominic Fike",                              album: "Singles",                               duration: "2:57", durationSec: 177, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/white_keys.mp3",                                   cover: resolveCoverSrc("/capas/dominic_fike.jpg") },
  { id:  10, title: "House Tour",                                  artist: "Sabrina Carpenter",                         album: "Short n' Sweet",                        duration: "3:19", durationSec: 199, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/house_tour.mp3",                                  cover: resolveCoverSrc("/capas/sabrina.jpg") },
  { id:  11, title: "Feather",                                     artist: "Sabrina Carpenter",                         album: "emails i can't send",                   duration: "2:58", durationSec: 178, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/feather.mp3",                                    cover: resolveCoverSrc("/capas/sabrina.jpg") },
  { id:  12, title: "Pai de Menina (Ao Vivo)",                     artist: "Zé Neto e Cristiano",                       album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/pai_de_menina_ao_vivo.mp3",                        cover: resolveCoverSrc("/capas/ze_neto_cristiano.jpg") },
  { id:  13, title: "Nobody's Son",                                artist: "Sabrina Carpenter",                         album: "emails i can't send",                   duration: "3:23", durationSec: 203, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/nobodys_son.mp3",                                 cover: resolveCoverSrc("/capas/sabrina.jpg") },
  { id:  14, title: "Toxic",                                       artist: "Britney Spears",                            album: "In the Zone",                           duration: "3:20", durationSec: 200, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/toxic.mp3",                                      cover: resolveCoverSrc("/capas/britney.jpg") },
  { id:  15, title: "Oops!...I Did It Again",                      artist: "Britney Spears",                            album: "Oops!...I Did It Again",                duration: "3:31", durationSec: 211, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/oops_i_did_it_again.mp3",                        cover: resolveCoverSrc("/capas/britney.jpg") },
  { id:  16, title: "...Baby One More Time",                       artist: "Britney Spears",                            album: "...Baby One More Time",                 duration: "3:31", durationSec: 211, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/baby_one_more_time.mp3",                         cover: resolveCoverSrc("/capas/britney.jpg") },
  { id:  17, title: "Acordando o Prédio",                          artist: "Luan Santana",                              album: "Singles",                               duration: "3:48", durationSec: 228, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/acordando_o_predio.mp3",                          cover: resolveCoverSrc("/capas/luan_santana.jpg") },
  { id:  18, title: "Cantada Ao Vivo",                             artist: "Luan Santana",                              album: "Ao Vivo",                               duration: "4:10", durationSec: 250, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cantada_ao_vivo.mp3",                             cover: resolveCoverSrc("/capas/luan_santana.jpg") },
  { id:  19, title: "Good Graces",                                 artist: "Sabrina Carpenter",                         album: "Short n' Sweet",                        duration: "3:05", durationSec: 185, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/good_graces.mp3",                                 cover: resolveCoverSrc("/capas/sabrina.jpg") },
  { id:  20, title: "Nonsense",                                    artist: "Sabrina Carpenter",                         album: "emails i can't send",                   duration: "2:57", durationSec: 177, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/nonsense.mp3",                                   cover: resolveCoverSrc("/capas/sabrina.jpg") },
  { id:  21, title: "Taste",                                       artist: "Sabrina Carpenter",                         album: "Short n' Sweet",                        duration: "2:37", durationSec: 157, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/taste.mp3",                                      cover: resolveCoverSrc("/capas/sabrina.jpg") },
  { id:  22, title: "Please Please Please",                        artist: "Sabrina Carpenter",                         album: "Short n' Sweet",                        duration: "3:06", durationSec: 186, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/please_please_please.mp3",                        cover: resolveCoverSrc("/capas/sabrina.jpg") },
  { id:  23, title: "Espresso",                                    artist: "Sabrina Carpenter",                         album: "Short n' Sweet",                        duration: "2:55", durationSec: 175, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/espresso.mp3",                                   cover: resolveCoverSrc("/capas/sabrina.jpg") },
  { id:  24, title: "WHERE IS MY HUSBAND",                         artist: "RAYE",                                      album: "My 21st Century Blues",                 duration: "3:02", durationSec: 182, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/where_is_my_husband.mp3",                          cover: resolveCoverSrc("/capas/raye.jpg") },
  { id:  25, title: "Take You Dancing",                            artist: "Jason Derulo",                              album: "Singles",                               duration: "2:51", durationSec: 171, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/take_you_dancing.mp3",                             cover: resolveCoverSrc("/capas/jason_derulo.jpg") },
  { id:  26, title: "Nothin' on You (feat. Bruno Mars)",           artist: "B.o.B, Bruno Mars",                         album: "B.o.B Presents: The Adventures of Bobby Ray", duration: "3:31", durationSec: 211, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/nothin_on_you.mp3",                          cover: resolveCoverSrc("/capas/bob.jpg") },
  { id:  27, title: "Lips Are Movin",                              artist: "Meghan Trainor",                            album: "Title",                                 duration: "3:08", durationSec: 188, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/lips_are_movin.mp3",                               cover: resolveCoverSrc("/capas/meghan_trainor.jpg") },
  { id:  28, title: "Love Me",                                     artist: "JMSN",                                      album: "Singles",                               duration: "3:45", durationSec: 225, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/love_me.mp3",                                      cover: resolveCoverSrc("/capas/jmsn.jpg") },
  { id:  29, title: "Price Tag",                                   artist: "Jessie J, B.o.B",                           album: "Who You Are",                           duration: "3:43", durationSec: 223, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/price_tag.mp3",                                   cover: resolveCoverSrc("/capas/jessie_j.jpg") },
  { id:  30, title: "Dance With Me",                               artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/dance_with_me.mp3",                               cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  31, title: "Nothing Left",                                artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/nothing_left.mp3",                                 cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  32, title: "Something Serious",                           artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/something_serious.mp3",                            cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  33, title: "On My Soul",                                  artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/on_my_soul.mp3",                                   cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  34, title: "Why You Wanna Fight?",                        artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/why_you_wanna_fight.mp3",                          cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  35, title: "God Was Showing Off",                         artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/god_was_showing_off.mp3",                          cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  36, title: "I Just Might",                                artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/i_just_might.mp3",                                 cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  37, title: "Cha Cha Cha",                                 artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cha_cha_cha.mp3",                                  cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  38, title: "Risk It All",                                 artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/risk_it_all.mp3",                                  cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  39, title: "Till the World Ends",                         artist: "Britney Spears",                            album: "Femme Fatale",                          duration: "3:35", durationSec: 215, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/till_the_world_ends.mp3",                          cover: resolveCoverSrc("/capas/britney.jpg") },
  { id:  40, title: "Levels (Radio Edit)",                         artist: "Avicii",                                    album: "Singles",                               duration: "3:19", durationSec: 199, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/levels_radio.mp3",                                 cover: resolveCoverSrc("/capas/avicii.jpg") },
  { id:  41, title: "Manchild",                                    artist: "Sabrina Carpenter",                         album: "Short n' Sweet",                        duration: "3:18", durationSec: 198, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/manchild.mp3",                                   cover: resolveCoverSrc("/capas/sabrina.jpg") },
  { id:  42, title: "Opalite",                                     artist: "Taylor Swift",                              album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/opalite.mp3",                                    cover: resolveCoverSrc("/capas/taylor_swift.jpg") },
  { id:  43, title: "DtMF",                                        artist: "Bad Bunny",                                 album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/dtmf.mp3",                                       cover: resolveCoverSrc("/capas/bad_bunny.jpg") },
  { id:  44, title: "Arrependidaço (Onde Você Andou)",             artist: "Ferrugem",                                  album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/arrependidaco.mp3",                                cover: resolveCoverSrc("/capas/ferrugem.jpg") },
  { id:  45, title: "Solo (feat. Demi Lovato)",                    artist: "Clean Bandit, Demi Lovato",                 album: "What Is Love?",                         duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/solo.mp3",                                       cover: resolveCoverSrc("/capas/clean_bandit.jpg") },
  { id:  46, title: "Tokyo Drift",                                 artist: "Xavier Wulf",                               album: "Singles",                               duration: "2:30", durationSec: 150, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/tokyo_drift.mp3",                                 cover: resolveCoverSrc("/capas/xavier_wulf.jpg") },
  { id:  47, title: "Despedida De Casal",                          artist: "Gustavo Mioto",                             album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/despedida_de_casal.mp3",                           cover: resolveCoverSrc("/capas/gustavo_mioto.jpg") },
  { id:  48, title: "I Just Might",                                artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/i_just_might.mp3",                               cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  49, title: "JETSKI",                                      artist: "PEDRO SAMPAIO, MC M...",                    album: "Singles",                               duration: "2:30", durationSec: 150, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/jetski.mp3",                                      cover: resolveCoverSrc("/capas/pedro_sampaio.jpg") },
  { id:  50, title: "Pela Última Vez (Ao Vivo)",                   artist: "Grupo Menos É Mais, NATT...",               album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/pela_ultima_vez_ao_vivo.mp3",                      cover: resolveCoverSrc("/capas/menos_e_mais.jpg") },
  { id:  51, title: "Santa Tell Me",                               artist: "Ariana Grande",                             album: "Christmas & Chill",                     duration: "3:12", durationSec: 192, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/santa_tell_me.mp3",                               cover: resolveCoverSrc("/capas/ariana.jpg") },
  { id:  52, title: "Peraí",                                       artist: "Jean Paulo Campos",                         album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/perai.mp3",                                      cover: resolveCoverSrc("/capas/jean_paulo.jpg") },
  { id:  53, title: "Wake Up In the Sky",                          artist: "Gucci Mane, Bruno Mars,...",                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/wake_up_in_the_sky.mp3",                           cover: resolveCoverSrc("/capas/gucci_mane.jpg") },
  { id:  54, title: "Mad at Disney",                               artist: "Salem Rose",                                album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/mad_at_disney.mp3",                               cover: resolveCoverSrc("/capas/salem_rose.jpg") },
  { id:  55, title: "Domingo de Manhã",                            artist: "Marcos & Belutti",                          album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/domingo_de_manha.mp3",                             cover: resolveCoverSrc("/capas/marcos_belutti.jpg") },
  { id:  56, title: "Constellations",                              artist: "Jade LeMac",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/constellations.mp3",                               cover: resolveCoverSrc("/capas/jade_lemac.jpg") },
  { id:  57, title: "Foi por Conveniência",                        artist: "Marília Mendonça",                          album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/foi_por_conveniencia.mp3",                         cover: resolveCoverSrc("/capas/marilia_mendonca.jpg") },
  { id:  58, title: "Caos De Alguém (Ao Vivo)",                    artist: "Felipe e Rodrigo",                          album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/caos_de_alguem_ao_vivo.mp3",                      cover: resolveCoverSrc("/capas/felipe_rodrigo.jpg") },
  { id:  59, title: "Alô Virginia (Ao Vivo)",                      artist: "Grupo Chocolate, Turma do Pagode",          album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/alo_virginia_ao_vivo.mp3",                         cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id:  60, title: "do re mi (feat. Gucci Mane)",                 artist: "Blackbear, Gucci Mane",                     album: "Singles",                               duration: "2:58", durationSec: 178, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/do_re_mi.mp3",                                    cover: resolveCoverSrc("/capas/blackbear.jpg") },
  { id:  61, title: "O Show Tem Que Continuar",                    artist: "Arlindo Cruz",                              album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/o_show_tem_que_continuar.mp3",                     cover: resolveCoverSrc("/capas/arlindo_cruz.jpg") },
  { id:  62, title: "So Easy (To Fall In Love)",                   artist: "Olivia Dean",                               album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/so_easy.mp3",                                    cover: resolveCoverSrc("/capas/olivia_dean.jpg") },
  { id:  63, title: "The Fate of Ophelia",                         artist: "Taylor Swift",                              album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/the_fate_of_ophelia.mp3",                          cover: resolveCoverSrc("/capas/taylor_swift.jpg") },
  { id:  64, title: "MTG PASSA PASSA PRA EU SA...",                artist: "Mc Livinho, DJ TOPO",                       album: "Singles",                               duration: "2:30", durationSec: 150, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/mtg_passa_passa.mp3",                              cover: resolveCoverSrc("/capas/mc_livinho.jpg") },
  { id:  65, title: "Desire",                                      artist: "Ian Asher, Olly Alexander (Years & Years)", album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/desire.mp3",                                     cover: resolveCoverSrc("/capas/ian_asher.jpg") },
  { id:  66, title: "Can't Hold Us (feat. Ray Dalton)",            artist: "Macklemore, Ryan Lewis, M...",              album: "The Heist",                             duration: "4:18", durationSec: 258, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cant_hold_us.mp3",                                 cover: resolveCoverSrc("/capas/macklemore.jpg") },
  { id:  67, title: "Coladinha em Mim (Ao Vivo)",                  artist: "Gustavo Mioto, Anitta",                     album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/coladinha_em_mim_ao_vivo.mp3",                    cover: resolveCoverSrc("/capas/gustavo_mioto.jpg") },
  { id:  68, title: "Vampiro",                                     artist: "Matuê, WIU, Teto",                          album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/vampiro.mp3",                                    cover: resolveCoverSrc("/capas/matue.jpg") },
  { id:  69, title: "You Da One",                                  artist: "Rihanna",                                   album: "Talk That Talk",                        duration: "3:34", durationSec: 214, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/you_da_one.mp3",                                  cover: resolveCoverSrc("/capas/rihanna.jpg") },
  { id:  70, title: "Vai Me Dando Corda (Ao Vivo)",                artist: "Grupo Menos É Mais, Di Pro...",             album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/vai_me_dando_corda_ao_vivo.mp3",                   cover: resolveCoverSrc("/capas/menos_e_mais.jpg") },
  { id:  71, title: "Todo Amor Do Mundo",                          artist: "Davizinho",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/todo_amor_do_mundo.mp3",                           cover: resolveCoverSrc("/capas/davizinho.jpg") },
  { id:  72, title: "Última Noite - Solo",                         artist: "Léo Foguete",                               album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/ultima_noite_solo.mp3",                             cover: resolveCoverSrc("/capas/leo_foguete.jpg") },
  { id:  73, title: "Morena Avelã",                                artist: "Léo Foguete",                               album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/morena_avela.mp3",                                 cover: resolveCoverSrc("/capas/leo_foguete.jpg") },
  { id:  74, title: "Tô te filmando (Sorria)",                     artist: "Os Travessos",                              album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/to_te_filmando.mp3",                               cover: resolveCoverSrc("/capas/os_travessos.jpg") },
  { id:  75, title: "Amor e Fé - Acústico",                        artist: "Hungria",                                   album: "Acústico",                              duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/amor_e_fe_acustico.mp3",                            cover: resolveCoverSrc("/capas/hungria.jpg") },
  { id:  76, title: "Sou Teu Fã",                                  artist: "DENNIS, Bruno Martini, Vitin",              album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/sou_teu_fa.mp3",                                  cover: resolveCoverSrc("/capas/dennis.jpg") },
  { id:  77, title: "Coração Partido (Corazón Part...)",           artist: "Grupo Menos É Mais",                        album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/coracao_partido.mp3",                              cover: resolveCoverSrc("/capas/menos_e_mais.jpg") },
  { id:  78, title: "Cópia Proibida",                              artist: "Léo Foguete",                               album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/copia_proibida.mp3",                               cover: resolveCoverSrc("/capas/leo_foguete.jpg") },
  { id:  79, title: "Faz Amor Tão Bem",                            artist: "Léo Foguete",                               album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/faz_amor_tao_bem.mp3",                             cover: resolveCoverSrc("/capas/leo_foguete.jpg") },
  { id:  80, title: "Quero Te Encontrar",                          artist: "Claudinho & Buchecha",                      album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/quero_te_encontrar.mp3",                           cover: resolveCoverSrc("/capas/claudinho_buchecha.jpg") },
  { id:  81, title: "The Sweet Escape",                            artist: "Gwen Stefani, Akon",                        album: "The Sweet Escape",                      duration: "3:51", durationSec: 231, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/the_sweet_escape.mp3",                             cover: resolveCoverSrc("/capas/gwen_stefani.jpg") },
  { id:  82, title: "No Way No",                                   artist: "MAGIC!",                                    album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/no_way_no.mp3",                                   cover: resolveCoverSrc("/capas/magic.jpg") },
  { id:  83, title: "Love Me Like You Do",                         artist: "Ellie Goulding",                            album: "Delirium",                              duration: "4:11", durationSec: 251, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/love_me_like_you_do.mp3",                          cover: resolveCoverSrc("/capas/ellie_goulding.jpg") },
  { id:  84, title: "Com você tô completo",                        artist: "Imaginasamba",                              album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/com_voce_to_completo.mp3",                         cover: resolveCoverSrc("/capas/imaginasamba.jpg") },
  { id:  85, title: "Never Let Me Go",                             artist: "Alok, Bruno Martini, Zeeba",                album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/never_let_me_go.mp3",                               cover: resolveCoverSrc("/capas/alok.jpg") },
  { id:  86, title: "Safe and Sound",                              artist: "Capital Cities",                            album: "In a Tidal Wave of Mystery",            duration: "3:06", durationSec: 186, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/safe_and_sound.mp3",                               cover: resolveCoverSrc("/capas/capital_cities.jpg") },
  { id:  87, title: "Buquê De Flores (Ao Vivo)",                   artist: "Thiaguinho",                                album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/buque_de_flores_ao_vivo.mp3",                      cover: resolveCoverSrc("/capas/thiaguinho.jpg") },
  { id:  88, title: "Transplante",                                 artist: "Marília Mendonça, Bruno & Marrone",         album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/transplante.mp3",                                  cover: resolveCoverSrc("/capas/marilia_mendonca.jpg") },
  { id:  89, title: "Beat It",                                     artist: "Michael Jackson",                           album: "Thriller",                              duration: "4:18", durationSec: 258, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/beat_it.mp3",                                     cover: resolveCoverSrc("/capas/michael_jackson.jpg") },
  { id:  90, title: "Meu Pacto",                                   artist: "Larissa Manoela",                           album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/meu_pacto.mp3",                                   cover: resolveCoverSrc("/capas/larissa_manoela.jpg") },
  { id:  91, title: "Bonde do Brunão",                             artist: "Bruno Mars",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/bonde_do_brunao.mp3",                              cover: resolveCoverSrc("/capas/bruno_mars.jpg") },
  { id:  92, title: "Strange",                                     artist: "Celeste",                                   album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/strange.mp3",                                     cover: resolveCoverSrc("/capas/celeste.jpg") },
  { id:  93, title: "Loka",                                        artist: "Simone & Simaria, Anitta",                  album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/loka.mp3",                                       cover: resolveCoverSrc("/capas/simone_simaria.jpg") },
  { id:  94, title: "Você Mente",                                  artist: "Zé Felipe",                                 album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/voce_mente.mp3",                                  cover: resolveCoverSrc("/capas/ze_felipe.jpg") },
  { id:  95, title: "Anos Luz",                                    artist: "Matuê",                                     album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/anos_luz.mp3",                                    cover: resolveCoverSrc("/capas/matue.jpg") },
  { id:  96, title: "Na batida",                                   artist: "Anitta",                                    album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/na_batida.mp3",                                   cover: resolveCoverSrc("/capas/anitta.jpg") },
  { id:  97, title: "Bang",                                        artist: "Anitta",                                    album: "Bang",                                  duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/bang.mp3",                                       cover: resolveCoverSrc("/capas/anitta.jpg") },
  { id:  98, title: "Menina má",                                   artist: "Anitta",                                    album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/menina_ma.mp3",                                   cover: resolveCoverSrc("/capas/anitta.jpg") },
  { id:  99, title: "Meiga e abusada",                             artist: "Anitta",                                    album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/meiga_e_abusada.mp3",                             cover: resolveCoverSrc("/capas/anitta.jpg") },
  { id: 100, title: "Moves Like Jagger",                           artist: "Maroon 5, Christina Aguilera",              album: "Hands All Over",                        duration: "3:22", durationSec: 202, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/moves_like_jagger.mp3",                           cover: resolveCoverSrc("/capas/maroon5.jpg") },
  { id: 101, title: "Cold (feat. Future)",                         artist: "Maroon 5, Future",                          album: "Red Pill Blues",                        duration: "3:52", durationSec: 232, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cold.mp3",                                       cover: resolveCoverSrc("/capas/maroon5.jpg") },
  { id: 102, title: "One More Night",                              artist: "Maroon 5",                                  album: "Overexposed",                           duration: "3:46", durationSec: 226, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/one_more_night.mp3",                              cover: resolveCoverSrc("/capas/maroon5.jpg") },
  { id: 103, title: "Sugar",                                       artist: "Maroon 5",                                  album: "V",                                     duration: "3:55", durationSec: 235, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/sugar.mp3",                                      cover: resolveCoverSrc("/capas/maroon5.jpg") },
  { id: 104, title: "Girls Like You (feat. Cardi B)",              artist: "Maroon 5, Cardi B",                         album: "Red Pill Blues",                        duration: "3:33", durationSec: 213, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/girls_like_you.mp3",                             cover: resolveCoverSrc("/capas/maroon5.jpg") },
  { id: 105, title: "Memories",                                    artist: "Maroon 5",                                  album: "Jordi",                                 duration: "3:09", durationSec: 189, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/memories.mp3",                                   cover: resolveCoverSrc("/capas/maroon5.jpg") },
  { id: 106, title: "Don't Wanna Know (feat. Kendrick Lamar)",     artist: "Maroon 5, Kendrick Lamar",                  album: "Red Pill Blues",                        duration: "3:24", durationSec: 204, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/dont_wanna_know.mp3",                            cover: resolveCoverSrc("/capas/maroon5.jpg") },
  { id: 107, title: "Swalla (feat. Nicki Minaj & Ty Dolla $ign)", artist: "Jason Derulo, Nicki Minaj...",              album: "Singles",                               duration: "3:27", durationSec: 207, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/swalla.mp3",                                     cover: resolveCoverSrc("/capas/jason_derulo.jpg") },
  { id: 108, title: "Never Be the Same",                           artist: "Camila Cabello",                            album: "Camila",                                duration: "3:44", durationSec: 224, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/never_be_the_same.mp3",                           cover: resolveCoverSrc("/capas/camila_cabello.jpg") },
  { id: 109, title: "Cuidado",                                     artist: "Gaab",                                      album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cuidado.mp3",                                    cover: resolveCoverSrc("/capas/gaab.jpg") },
  { id: 110, title: "good 4 u",                                    artist: "Olivia Rodrigo",                            album: "SOUR",                                  duration: "2:58", durationSec: 178, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/good_4_u.mp3",                                   cover: resolveCoverSrc("/capas/olivia_rodrigo.jpg") },
  { id: 111, title: "Princesa (Ao Vivo)",                          artist: "Gustavo Mioto, Ana Castela",                album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/princesa_ao_vivo.mp3",                            cover: resolveCoverSrc("/capas/gustavo_mioto.jpg") },
  { id: 112, title: "Red",                                         artist: "Kylie Cantrall, Alex Boniello, Disney",     album: "Descendants: The Rise of Red",          duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/red.mp3",                                       cover: resolveCoverSrc("/capas/kylie_cantrall.jpg") },
  { id: 113, title: "Aonde Quer Chegar",                           artist: "Turma do Pagode, Gaab",                     album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/aonde_quer_chegar.mp3",                           cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 114, title: "Interessante",                                artist: "Ferrugem",                                  album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/interessante.mp3",                               cover: resolveCoverSrc("/capas/ferrugem.jpg") },
  { id: 115, title: "What Makes You Beautiful",                    artist: "One Direction",                             album: "Up All Night",                          duration: "3:19", durationSec: 199, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/what_makes_you_beautiful.mp3",                   cover: resolveCoverSrc("/capas/one_direction.jpg") },
  { id: 116, title: "Never Say Never",                             artist: "Justin Bieber, Jaden",                      album: "Never Say Never",                       duration: "4:01", durationSec: 241, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/never_say_never.mp3",                            cover: resolveCoverSrc("/capas/justin_bieber.jpg") },
  { id: 117, title: "Medalha de Prata (Ao Vivo)",                  artist: "Zé Felipe, Maiara & Maraísa",               album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/medalha_de_prata_ao_vivo.mp3",                   cover: resolveCoverSrc("/capas/ze_felipe.jpg") },
  { id: 118, title: "Saudade de Você",                             artist: "Zé Felipe",                                 album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/saudade_de_voce.mp3",                            cover: resolveCoverSrc("/capas/ze_felipe.jpg") },
  { id: 119, title: "Melhor Amigo (Ao Vivo)",                      artist: "Turma do Pagode",                           album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/melhor_amigo_ao_vivo.mp3",                       cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 120, title: "Caso Indefinido (Ao Vivo)",                   artist: "Cristiano Araújo",                          album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/caso_indefinido_ao_vivo.mp3",                    cover: resolveCoverSrc("/capas/cristiano_araujo.jpg") },
  { id: 121, title: "ME! (feat. Brendon Urie of Panic! At The Disco)", artist: "Taylor Swift, Brendon Urie",           album: "Singles",                               duration: "3:13", durationSec: 193, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/me.mp3",                                        cover: resolveCoverSrc("/capas/taylor_swift.jpg") },
  { id: 122, title: "Travesseiro",                                 artist: "Ana Laura Lopes",                           album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/travesseiro.mp3",                                 cover: resolveCoverSrc("/capas/ana_laura.jpg") },
  { id: 123, title: "A boba fui eu (part. Jão)",                   artist: "LUDMILLA, Jão",                             album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/a_boba_fui_eu.mp3",                               cover: resolveCoverSrc("/capas/ludmilla.jpg") },
  { id: 124, title: "Cadeira de Aço (Ao Vivo)",                    artist: "Zé Neto & Cristiano",                       album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cadeira_de_aco_ao_vivo.mp3",                     cover: resolveCoverSrc("/capas/ze_neto_cristiano.jpg") },
  { id: 125, title: "Com Ou Sem Mim (Ao Vivo)",                    artist: "Gustavo Mioto",                             album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/com_ou_sem_mim_ao_vivo.mp3",                     cover: resolveCoverSrc("/capas/gustavo_mioto.jpg") },
  { id: 126, title: "Esqueci Como Namora (feat. Maiara & Maraísa)", artist: "Nego do Borel, Maiara & Maraísa",          album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/esqueci_como_namora.mp3",                       cover: resolveCoverSrc("/capas/nego_do_borel.jpg") },
  { id: 127, title: "Tubarões (Ao Vivo)",                          artist: "Diego & Victor Hugo",                       album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/tubaroes_ao_vivo.mp3",                            cover: resolveCoverSrc("/capas/diego_victor_hugo.jpg") },
  { id: 128, title: "Romântico (Ao Vivo)",                         artist: "Henrique & Juliano",                        album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/romantico_ao_vivo.mp3",                           cover: resolveCoverSrc("/capas/henrique_juliano.jpg") },
  { id: 129, title: "NÃO VAI ME AMAR",                             artist: "Caio Luccas, NADAMAL, Veigh, Hon...",       album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/nao_vai_me_amar.mp3",                              cover: resolveCoverSrc("/capas/caio_luccas.jpg") },
  { id: 130, title: "Heartbreak Anniversary",                      artist: "GIVĒON",                                    album: "Take Time",                             duration: "3:18", durationSec: 198, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/heartbreak_anniversary.mp3",                      cover: resolveCoverSrc("/capas/giveon.jpg") },
  { id: 131, title: "Dangerous Woman",                             artist: "Ariana Grande",                             album: "Dangerous Woman",                       duration: "3:55", durationSec: 235, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/dangerous_woman.mp3",                             cover: resolveCoverSrc("/capas/ariana.jpg") },
  { id: 132, title: "Tanto Faz (Ao Vivo)",                         artist: "Luan Santana",                              album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/tanto_faz_ao_vivo.mp3",                           cover: resolveCoverSrc("/capas/luan_santana.jpg") },
  { id: 133, title: "Entregador de Flor (Ao Vivo)",                artist: "Diego & Victor Hugo",                       album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/entregador_de_flor_ao_vivo.mp3",                  cover: resolveCoverSrc("/capas/diego_victor_hugo.jpg") },
  { id: 134, title: "Sosseguei",                                   artist: "Jorge & Mateus",                            album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/sosseguei.mp3",                                   cover: resolveCoverSrc("/capas/jorge_mateus.jpg") },
  { id: 135, title: "O Que É Que Tem (Ao Vivo)",                   artist: "Jorge & Mateus",                            album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/o_que_e_que_tem_ao_vivo.mp3",                     cover: resolveCoverSrc("/capas/jorge_mateus.jpg") },
  { id: 136, title: "Baby Cê é Gata",                              artist: "Kyan, Mu540",                               album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/baby_ce_e_gata.mp3",                               cover: resolveCoverSrc("/capas/kyan.jpg") },
  { id: 137, title: "Lonely",                                      artist: "Akon",                                      album: "Trouble",                               duration: "3:42", durationSec: 222, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/lonely.mp3",                                     cover: resolveCoverSrc("/capas/akon.jpg") },
  { id: 138, title: "I Like Me Better",                            artist: "Lauv",                                      album: "~how i'm feeling~",                     duration: "3:08", durationSec: 188, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/i_like_me_better.mp3",                            cover: resolveCoverSrc("/capas/lauv.jpg") },
  { id: 139, title: "Show Me Love",                                artist: "Robin S, JUMPA",                            album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/show_me_love.mp3",                                 cover: resolveCoverSrc("/capas/robin_s.jpg") },
  { id: 140, title: "Outside (feat. Ellie Goulding)",              artist: "Calvin Harris, Ellie Goulding",             album: "Motion",                                duration: "3:38", durationSec: 218, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/outside.mp3",                                     cover: resolveCoverSrc("/capas/calvin_harris.jpg") },
  { id: 141, title: "Dias de Luta, Dias de Glória (Ao Vivo)",      artist: "Charlie Brown Jr.",                         album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/dias_de_luta.mp3",                                 cover: resolveCoverSrc("/capas/charlie_brown_jr.jpg") },
  { id: 142, title: "Mozão",                                       artist: "Lucas Lucco",                               album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/mozao.mp3",                                      cover: resolveCoverSrc("/capas/lucas_lucco.jpg") },
  { id: 143, title: "I Like Me Better",                            artist: "Lauv",                                      album: "~how i'm feeling~",                     duration: "3:08", durationSec: 188, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/i_like_me_better_2.mp3",                          cover: resolveCoverSrc("/capas/lauv.jpg") },
  { id: 144, title: "Já Sei Namorar (2004 Digital Remaster)",      artist: "Tribalistas",                               album: "Tribalistas",                           duration: "3:49", durationSec: 229, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/ja_sei_namorar.mp3",                               cover: resolveCoverSrc("/capas/tribalistas.jpg") },
  { id: 145, title: "Velha Infância (2004 Digital Remaster)",      artist: "Tribalistas",                               album: "Tribalistas",                           duration: "4:04", durationSec: 244, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/velha_infancia.mp3",                              cover: resolveCoverSrc("/capas/tribalistas.jpg") },
  { id: 146, title: "Let Me Love You",                             artist: "Ariana Grande, Lil Wayne",                  album: "My Everything",                         duration: "3:31", durationSec: 211, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/let_me_love_you.mp3",                              cover: resolveCoverSrc("/capas/ariana.jpg") },
  { id: 147, title: "Cold Water (feat. Justin Bieber)",            artist: "Major Lazer, Justin Bieber, MØ",            album: "Music Is the Weapon",                   duration: "3:24", durationSec: 204, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cold_water.mp3",                                  cover: resolveCoverSrc("/capas/major_lazer.jpg") },
  { id: 148, title: "Lights (Single Version)",                     artist: "Ellie Goulding",                            album: "Lights",                                duration: "3:47", durationSec: 227, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/lights.mp3",                                     cover: resolveCoverSrc("/capas/ellie_goulding.jpg") },
  { id: 149, title: "Enfim",                                       artist: "Start Rap, Medellin",                       album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/enfim.mp3",                                      cover: resolveCoverSrc("/capas/start_rap.jpg") },
  { id: 150, title: "Beautiful Things",                            artist: "Benson Boone",                              album: "Fireworks & Rollerblades",              duration: "3:33", durationSec: 213, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/beautiful_things.mp3",                            cover: resolveCoverSrc("/capas/benson_boone.jpg") },
  { id: 151, title: "From Now On",                                 artist: "The Features",                              album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/from_now_on.mp3",                                 cover: resolveCoverSrc("/capas/the_features.jpg") },
  { id: 152, title: "Eyes on Fire",                                artist: "Blue Foundation",                           album: "Eyes on Fire",                          duration: "4:24", durationSec: 264, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/eyes_on_fire.mp3",                                 cover: resolveCoverSrc("/capas/blue_foundation.jpg") },
  { id: 153, title: "Turning Page (Live)",                         artist: "Sleeping At Last",                          album: "Live",                                  duration: "4:14", durationSec: 254, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/turning_page_live.mp3",                            cover: resolveCoverSrc("/capas/sleeping_at_last.jpg") },
  { id: 154, title: "Where Is The Love?",                          artist: "Black Eyed Peas",                           album: "Elephunk",                              duration: "4:23", durationSec: 263, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/where_is_the_love.mp3",                            cover: resolveCoverSrc("/capas/black_eyed_peas.jpg") },
  { id: 155, title: "Mama Said",                                   artist: "Lukas Graham",                              album: "3 (The Purple Album)",                  duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/mama_said.mp3",                                   cover: resolveCoverSrc("/capas/lukas_graham.jpg") },
  { id: 156, title: "Fat Juicy & Wet",                             artist: "Sexyy Red, Bruno Mars",                     album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/fat_juicy_and_wet.mp3",                            cover: resolveCoverSrc("/capas/sexyy_red.jpg") },
  { id: 157, title: "La La La",                                    artist: "Naughty Boy, Sam Smith",                    album: "Hotel Cabana",                          duration: "3:48", durationSec: 228, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/la_la_la.mp3",                                   cover: resolveCoverSrc("/capas/naughty_boy.jpg") },
  { id: 158, title: "A Droga do Amor",                             artist: "Ari, Felipe Play, Dom R, Tiankris",         album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/a_droga_do_amor.mp3",                              cover: resolveCoverSrc("/capas/ari.jpg") },
  { id: 159, title: "O Sol e a Lua",                               artist: "Pequeno Cidadão",                           album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/o_sol_e_a_lua.mp3",                               cover: resolveCoverSrc("/capas/pequeno_cidadao.jpg") },
  { id: 160, title: "Best Part (feat. H.E.R.)",                    artist: "Daniel Caesar, H.E.R.",                     album: "Freudian",                              duration: "3:33", durationSec: 213, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/best_part.mp3",                                   cover: resolveCoverSrc("/capas/daniel_caesar.jpg") },
  { id: 161, title: "O Vagabundo e a Dama",                        artist: "Oriente",                                   album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/o_vagabundo_e_a_dama.mp3",                         cover: resolveCoverSrc("/capas/oriente.jpg") },
  { id: 162, title: "Pra Você",                                    artist: "Onze:20",                                   album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/pra_voce.mp3",                                    cover: resolveCoverSrc("/capas/onze20.jpg") },
  { id: 163, title: "Cabelos de Algodão",                          artist: "Banda Fly",                                 album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cabelos_de_algodao.mp3",                           cover: resolveCoverSrc("/capas/banda_fly.jpg") },
  { id: 164, title: "Miraculous (générique de la série)",          artist: "Lou, Lenni Kim",                            album: "Miraculous",                            duration: "2:30", durationSec: 150, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/miraculous.mp3",                                   cover: resolveCoverSrc("/capas/miraculous.jpg") },
  { id: 165, title: "Toda Toda",                                   artist: "Pikeno & Menor",                            album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/toda_toda.mp3",                                   cover: resolveCoverSrc("/capas/pikeno_menor.jpg") },
  { id: 166, title: "Lovers",                                      artist: "Anna of the North",                         album: "Lovers",                                duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/lovers.mp3",                                     cover: resolveCoverSrc("/capas/anna_of_the_north.jpg") },
  { id: 167, title: "Glad You Came",                               artist: "The Wanted",                                album: "Word of Mouth",                         duration: "3:11", durationSec: 191, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/glad_you_came.mp3",                               cover: resolveCoverSrc("/capas/the_wanted.jpg") },
  { id: 168, title: "Antídoto (Ao Vivo)",                          artist: "Matheus & Kauan",                           album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/antidoto_ao_vivo.mp3",                            cover: resolveCoverSrc("/capas/matheus_kauan.jpg") },
  { id: 169, title: "Runaway (U & I)",                             artist: "Galantis",                                  album: "Pharmacy",                              duration: "3:32", durationSec: 212, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/runaway_u_and_i.mp3",                              cover: resolveCoverSrc("/capas/galantis.jpg") },
  { id: 170, title: "Am I Wrong",                                  artist: "Nico & Vinz",                               album: "Black Star Elephant",                   duration: "3:28", durationSec: 208, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/am_i_wrong.mp3",                                  cover: resolveCoverSrc("/capas/nico_vinz.jpg") },
  { id: 171, title: "Lapada Dela (Ao Vivo)",                       artist: "Grupo Menos É Mais, Matheus...",            album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/lapada_dela_ao_vivo.mp3",                          cover: resolveCoverSrc("/capas/menos_e_mais.jpg") },
  { id: 172, title: "Na Hora Da Raiva (Ao Vivo)",                  artist: "Henrique & Juliano",                        album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/na_hora_da_raiva_ao_vivo.mp3",                    cover: resolveCoverSrc("/capas/henrique_juliano.jpg") },
  { id: 173, title: "O Nosso Santo Bateu - Live",                  artist: "Matheus & Kauan",                           album: "Live",                                  duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/o_nosso_santo_bateu_live.mp3",                     cover: resolveCoverSrc("/capas/matheus_kauan.jpg") },
  { id: 174, title: "Propaganda (Ao Vivo)",                        artist: "Jorge & Mateus",                            album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/propaganda_ao_vivo.mp3",                          cover: resolveCoverSrc("/capas/jorge_mateus.jpg") },
  { id: 175, title: "Tá Vendo Aquela Lua",                         artist: "Exaltasamba",                               album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/ta_vendo_aquela_lua.mp3",                          cover: resolveCoverSrc("/capas/exaltasamba.jpg") },
  { id: 176, title: "Alô Ambev (Segue Sua Vida)",                  artist: "Zé Neto & Cristiano",                       album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/alo_ambev.mp3",                                   cover: resolveCoverSrc("/capas/ze_neto_cristiano.jpg") },
  { id: 177, title: "Yummy",                                       artist: "Justin Bieber",                             album: "Changes",                               duration: "3:33", durationSec: 213, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/yummy.mp3",                                      cover: resolveCoverSrc("/capas/justin_bieber.jpg") },
  { id: 178, title: "Earned It (Fifty Shades Of Grey)",            artist: "The Weeknd",                                album: "Beauty Behind the Madness",             duration: "4:48", durationSec: 288, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/earned_it.mp3",                                   cover: resolveCoverSrc("/capas/the_weeknd.jpg") },
  { id: 179, title: "Woo",                                         artist: "Rihanna",                                   album: "Rated R",                               duration: "3:41", durationSec: 221, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/woo.mp3",                                       cover: resolveCoverSrc("/capas/rihanna.jpg") },
  { id: 180, title: "GUY.exe",                                     artist: "Superfruit",                                album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/guy_exe.mp3",                                    cover: resolveCoverSrc("/capas/superfruit.jpg") },
  { id: 181, title: "In the Name of Love",                         artist: "Martin Garrix, Bebe Rexha",                 album: "Singles",                               duration: "3:17", durationSec: 197, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/in_the_name_of_love.mp3",                         cover: resolveCoverSrc("/capas/martin_garrix.jpg") },
  { id: 182, title: "NO",                                          artist: "Meghan Trainor",                            album: "Thank You",                             duration: "3:04", durationSec: 184, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/no.mp3",                                        cover: resolveCoverSrc("/capas/meghan_trainor.jpg") },
  { id: 183, title: "Sua Mãe Vai Me Amar",                         artist: "Turma do Pagode",                           album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/sua_mae_vai_me_amar.mp3",                         cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 184, title: "Deixa em Off (Ao Vivo)",                      artist: "Turma do Pagode",                           album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/deixa_em_off_ao_vivo.mp3",                       cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 185, title: "Say So",                                      artist: "Doja Cat",                                  album: "Hot Pink",                              duration: "3:59", durationSec: 239, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/say_so.mp3",                                    cover: resolveCoverSrc("/capas/doja_cat.jpg") },
  { id: 186, title: "Um Pôr do Sol na Praia",                      artist: "LUDMILLA",                                  album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/um_por_do_sol_na_praia.mp3",                      cover: resolveCoverSrc("/capas/ludmilla.jpg") },
  { id: 187, title: "Camisa 10 (Ao Vivo)",                         artist: "Turma do Pagode",                           album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/camisa_10_ao_vivo.mp3",                          cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 188, title: "Over (Sped Up)",                              artist: "Lucky Daye",                                album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/over_sped_up.mp3",                               cover: resolveCoverSrc("/capas/lucky_daye.jpg") },
  { id: 189, title: "Selinho (Ao Vivo)",                           artist: "Turma do Pagode",                           album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/selinho_ao_vivo.mp3",                            cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 190, title: "Reflections",                                 artist: "The Neighbourhood",                         album: "I Love You.",                           duration: "3:59", durationSec: 239, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/reflections.mp3",                                 cover: resolveCoverSrc("/capas/the_neighbourhood.jpg") },
  { id: 191, title: "Camisa 10 (Ao Vivo)",                         artist: "Turma do Pagode",                           album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/camisa_10_ao_vivo.mp3",                        cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 192, title: "Tão Linda",                                   artist: "Atitude 67",                                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/tao_linda.mp3",                                   cover: resolveCoverSrc("/capas/atitude_67.jpg") },
  { id: 193, title: "Maniac",                                      artist: "Conan Gray",                                album: "Kid Krow",                              duration: "2:42", durationSec: 162, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/maniac.mp3",                                     cover: resolveCoverSrc("/capas/conan_gray.jpg") },
  { id: 194, title: "Confident",                                   artist: "Justin Bieber, Chance the Rapper",          album: "Singles",                               duration: "3:23", durationSec: 203, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/confident.mp3",                                  cover: resolveCoverSrc("/capas/justin_bieber.jpg") },
  { id: 195, title: "Fingo Que Me Adora",                          artist: "QuatroK",                                   album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/fingo_que_me_adora.mp3",                         cover: resolveCoverSrc("/capas/quatrok.jpg") },
  { id: 196, title: "ALÔ POLÍCIA!",                                artist: "QuatroK",                                   album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/alo_policia.mp3",                                 cover: resolveCoverSrc("/capas/quatrok.jpg") },
  { id: 197, title: "Sing",                                        artist: "Ed Sheeran",                                album: "X",                                     duration: "3:54", durationSec: 234, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/sing.mp3",                                       cover: resolveCoverSrc("/capas/ed_sheeran.jpg") },
  { id: 198, title: "MAYBE",                                       artist: "Gabriela Bee",                              album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/maybe.mp3",                                      cover: resolveCoverSrc("/capas/gabriela_bee.jpg") },
  { id: 199, title: "Don't Worry (with Ray Dalton)",               artist: "Madcon, Ray Dalton",                        album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/dont_worry.mp3",                                 cover: resolveCoverSrc("/capas/madcon.jpg") },
  { id: 200, title: "Flor E O Beija-Flor (Ao Vivo)",              artist: "Henrique & Juliano, Marília Mendonça",      album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/flor_e_o_beija_flor_ao_vivo.mp3",               cover: resolveCoverSrc("/capas/henrique_juliano.jpg") },
  { id: 201, title: "Alô Porteiro (Ao Vivo)",                      artist: "Henrique & Juliano, Marília Mendonça",      album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/alo_porteiro_ao_vivo.mp3",                      cover: resolveCoverSrc("/capas/henrique_juliano.jpg") },
  { id: 202, title: "Bebaça (Ao Vivo)",                            artist: "Marília Mendonça, Maiara & Maraísa",        album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/bebaca_ao_vivo.mp3",                             cover: resolveCoverSrc("/capas/marilia_mendonca.jpg") },
  { id: 203, title: "Graveto (Ao Vivo)",                           artist: "Marília Mendonça",                          album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/graveto_ao_vivo.mp3",                            cover: resolveCoverSrc("/capas/marilia_mendonca.jpg") },
  { id: 204, title: "I Wanna Be Yours",                            artist: "Arctic Monkeys",                            album: "AM",                                    duration: "3:03", durationSec: 183, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/i_wanna_be_yours.mp3",                            cover: resolveCoverSrc("/capas/arctic_monkeys.jpg") },
  { id: 205, title: "Lean On",                                     artist: "Major Lazer, DJ Snake, MØ",                 album: "Peace Is the Mission",                  duration: "2:59", durationSec: 179, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/lean_on.mp3",                                    cover: resolveCoverSrc("/capas/major_lazer.jpg") },
  { id: 206, title: "Pirata e tesouro (Ao Vivo)",                  artist: "Ferrugem",                                  album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/pirata_e_tesouro_ao_vivo.mp3",                   cover: resolveCoverSrc("/capas/ferrugem.jpg") },
  { id: 207, title: "Counting Stars",                              artist: "OneRepublic",                               album: "Native",                                duration: "4:17", durationSec: 257, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/counting_stars.mp3",                              cover: resolveCoverSrc("/capas/onerepublic.jpg") },
  { id: 208, title: "Summer",                                      artist: "Calvin Harris",                             album: "Motion",                                duration: "3:45", durationSec: 225, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/summer.mp3",                                     cover: resolveCoverSrc("/capas/calvin_harris.jpg") },
  { id: 209, title: "Eu, Você, O Mar e Ela",                       artist: "Luan Santana",                              album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/eu_voce_o_mar_e_ela.mp3",                         cover: resolveCoverSrc("/capas/luan_santana.jpg") },
  { id: 210, title: "Amar Não é Pecado (Ao Vivo)",                 artist: "Luan Santana",                              album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/amar_nao_e_pecado_ao_vivo.mp3",                  cover: resolveCoverSrc("/capas/luan_santana.jpg") },
  { id: 211, title: "Vagalumes",                                   artist: "POLLO, Ivo Mozart",                         album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/vagalumes.mp3",                                   cover: resolveCoverSrc("/capas/pollo.jpg") },
  { id: 212, title: "death bed (coffee for your head)",            artist: "Powfu, beabadoobee",                        album: "Singles",                               duration: "2:53", durationSec: 173, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/death_bed.mp3",                                   cover: resolveCoverSrc("/capas/powfu.jpg") },
  { id: 213, title: "Atrasadinha - Live",                          artist: "Felipe Araújo, Ferrugem",                   album: "Live",                                  duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/atrasadinha_live.mp3",                            cover: resolveCoverSrc("/capas/felipe_araujo.jpg") },
  { id: 214, title: "Vai Vendo",                                   artist: "Lucas Lucco",                               album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/vai_vendo.mp3",                                   cover: resolveCoverSrc("/capas/lucas_lucco.jpg") },
  { id: 215, title: "Bye Bye (Ao Vivo)",                           artist: "Marília Mendonça",                          album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/bye_bye_ao_vivo.mp3",                            cover: resolveCoverSrc("/capas/marilia_mendonca.jpg") },
  { id: 216, title: "Tudo Que Você Quiser (Ao Vivo)",              artist: "Luan Santana",                              album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/tudo_que_voce_quiser_ao_vivo.mp3",                cover: resolveCoverSrc("/capas/luan_santana.jpg") },
  { id: 217, title: "Eu Sei de Cor (Ao Vivo)",                     artist: "Marília Mendonça",                          album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/eu_sei_de_cor_ao_vivo.mp3",                      cover: resolveCoverSrc("/capas/marilia_mendonca.jpg") },
  { id: 218, title: "APT.",                                        artist: "ROSÉ, Bruno Mars",                          album: "Singles",                               duration: "2:57", durationSec: 177, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/apt.mp3",                                        cover: resolveCoverSrc("/capas/rose.jpg") },
  { id: 219, title: "Te Vivo",                                     artist: "Luan Santana",                              album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/te_vivo.mp3",                                    cover: resolveCoverSrc("/capas/luan_santana.jpg") },
  { id: 220, title: "On & On",                                     artist: "Cartoon, Jéja, Daniel Levi",                album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/on_and_on.mp3",                                  cover: resolveCoverSrc("/capas/cartoon.jpg") },
  { id: 221, title: "Put Your Records On",                         artist: "Ritt Momney",                               album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/put_your_records_on.mp3",                         cover: resolveCoverSrc("/capas/ritt_momney.jpg") },
  { id: 222, title: "That's What I Like",                          artist: "Bruno Mars",                                album: "24K Magic",                             duration: "3:28", durationSec: 208, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/thats_what_i_like.mp3",                          cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 223, title: "Péssimo Negócio (Ao Vivo)",                   artist: "Dilsinho",                                  album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/pessimo_negocio_ao_vivo.mp3",                    cover: resolveCoverSrc("/capas/dilsinho.jpg") },
  { id: 224, title: "Deixa Alagar (Ao Vivo)",                      artist: "Grupo Revelação",                           album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/deixa_alagar_ao_vivo.mp3",                      cover: resolveCoverSrc("/capas/grupo_revelacao.jpg") },
  { id: 225, title: "Até Que Durou",                               artist: "Péricles",                                  album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/ate_que_durou.mp3",                              cover: resolveCoverSrc("/capas/pericles.jpg") },
  { id: 226, title: "Decide Aí - Na Praia / Ao Vivo",             artist: "Matheus & Kauan",                           album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/decide_ai_ao_vivo.mp3",                          cover: resolveCoverSrc("/capas/matheus_kauan.jpg") },
  { id: 227, title: "Louca de Saudade (Ao Vivo)",                  artist: "Jorge & Mateus",                            album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/louca_de_saudade_ao_vivo.mp3",                   cover: resolveCoverSrc("/capas/jorge_mateus.jpg") },
  { id: 228, title: "Barulho Do Foguete (Ao Vivo)",                artist: "Zé Neto & Cristiano",                       album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/barulho_do_foguete_ao_vivo.mp3",                 cover: resolveCoverSrc("/capas/ze_neto_cristiano.jpg") },
  { id: 229, title: "Notificação Preferida (Ao Vivo)",             artist: "Zé Neto & Cristiano",                       album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/notificacao_preferida_ao_vivo.mp3",             cover: resolveCoverSrc("/capas/ze_neto_cristiano.jpg") },
  { id: 230, title: "Mulher Maravilha (Ao Vivo)",                  artist: "Zé Neto & Cristiano",                       album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/mulher_maravilha_ao_vivo.mp3",                  cover: resolveCoverSrc("/capas/ze_neto_cristiano.jpg") },
  { id: 231, title: "Vou Ter Que Superar (Ao Vivo)",               artist: "Matheus & Kauan, Marília Mendonça",         album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/vou_ter_que_superar_ao_vivo.mp3",               cover: resolveCoverSrc("/capas/matheus_kauan.jpg") },
  { id: 232, title: "Raspão (feat. Simone & Simaria)",             artist: "Henrique & Diego, Simone & Simaria",        album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/raspao.mp3",                                    cover: resolveCoverSrc("/capas/henrique_diego.jpg") },
  { id: 233, title: "Glimpse of Us",                               artist: "Joji",                                      album: "Smithereens",                           duration: "3:55", durationSec: 235, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/glimpse_of_us.mp3",                              cover: resolveCoverSrc("/capas/joji.jpg") },
  { id: 234, title: "Bye Bye Bye",                                 artist: "*NSYNC",                                    album: "No Strings Attached",                   duration: "3:22", durationSec: 202, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/bye_bye_bye.mp3",                                 cover: resolveCoverSrc("/capas/nsync.jpg") },
  { id: 235, title: "Tudo Que Você Quiser (Ao Vivo)",              artist: "Luan Santana",                              album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/tudo_que_voce_quiser_ao_vivo.mp3",              cover: resolveCoverSrc("/capas/luan_santana.jpg") },
  { id: 236, title: "Fantasma",                                    artist: "Ana Laura Lopes",                           album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/fantasma.mp3",                                   cover: resolveCoverSrc("/capas/ana_laura.jpg") },
  { id: 237, title: "Te Esperando",                                artist: "Luan Santana",                              album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/te_esperando.mp3",                                 cover: resolveCoverSrc("/capas/luan_santana.jpg") },
  { id: 238, title: "Refém - Video",                               artist: "Dilsinho",                                  album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/refem.mp3",                                     cover: resolveCoverSrc("/capas/dilsinho.jpg") },
  { id: 239, title: "Medo Bobo",                                   artist: "Rubel",                                     album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/medo_bobo.mp3",                                   cover: resolveCoverSrc("/capas/rubel.jpg") },
  { id: 240, title: "Safe And Sound",                              artist: "Capital Cities",                            album: "In a Tidal Wave of Mystery",            duration: "3:06", durationSec: 186, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/safe_and_sound.mp3",                            cover: resolveCoverSrc("/capas/capital_cities.jpg") },
  { id: 241, title: "Somewhere in Brooklyn",                       artist: "Bruno Mars",                                album: "Doo-Wops & Hooligans",                  duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/somewhere_in_brooklyn.mp3",                      cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 242, title: "STAY (with Justin Bieber)",                   artist: "The Kid LAROI, Justin Bieber",              album: "Singles",                               duration: "2:21", durationSec: 141, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/stay.mp3",                                       cover: resolveCoverSrc("/capas/kid_laroi.jpg") },
  { id: 243, title: "Diamonds",                                    artist: "Sam Smith",                                 album: "Love Goes",                             duration: "3:04", durationSec: 184, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/diamonds.mp3",                                   cover: resolveCoverSrc("/capas/sam_smith.jpg") },
  { id: 244, title: "New Rules",                                   artist: "Dua Lipa",                                  album: "Dua Lipa",                              duration: "3:29", durationSec: 209, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/new_rules.mp3",                                   cover: resolveCoverSrc("/capas/dua_lipa.jpg") },
  { id: 245, title: "I'm Not The Only One",                        artist: "Sam Smith",                                 album: "In the Lonely Hour",                    duration: "3:43", durationSec: 223, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/im_not_the_only_one.mp3",                         cover: resolveCoverSrc("/capas/sam_smith.jpg") },
  { id: 246, title: "Here",                                        artist: "Alessia Cara",                              album: "Know-It-All",                           duration: "3:44", durationSec: 224, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/here.mp3",                                       cover: resolveCoverSrc("/capas/alessia_cara.jpg") },
  { id: 247, title: "motive (with Doja Cat)",                      artist: "Ariana Grande, Doja Cat",                   album: "Positions",                             duration: "2:38", durationSec: 158, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/motive.mp3",                                     cover: resolveCoverSrc("/capas/ariana.jpg") },
  { id: 248, title: "positions",                                   artist: "Ariana Grande",                             album: "Positions",                             duration: "2:52", durationSec: 172, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/positions.mp3",                                   cover: resolveCoverSrc("/capas/ariana.jpg") },
  { id: 249, title: "pov",                                         artist: "Ariana Grande",                             album: "Positions",                             duration: "3:31", durationSec: 211, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/pov.mp3",                                        cover: resolveCoverSrc("/capas/ariana.jpg") },
  { id: 250, title: "Die With A Smile",                            artist: "Lady Gaga, Bruno Mars",                     album: "Singles",                               duration: "4:11", durationSec: 251, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/die_with_a_smile.mp3",                            cover: resolveCoverSrc("/capas/lady_gaga.jpg") },
  { id: 251, title: "Bye Bye Bye",                                 artist: "*NSYNC",                                    album: "No Strings Attached",                   duration: "3:22", durationSec: 202, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/bye_bye_bye.mp3",                               cover: resolveCoverSrc("/capas/nsync.jpg") },
  { id: 252, title: "Sunroof",                                     artist: "Nicky Youre, dazy",                         album: "Singles",                               duration: "2:26", durationSec: 146, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/sunroof.mp3",                                    cover: resolveCoverSrc("/capas/nicky_youre.jpg") },
  { id: 253, title: "As It Was",                                   artist: "Harry Styles",                              album: "Harry's House",                         duration: "2:37", durationSec: 157, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/as_it_was.mp3",                                   cover: resolveCoverSrc("/capas/harry_styles.jpg") },
  { id: 254, title: "Mood (feat. iann dior)",                      artist: "24kGoldn, iann dior",                       album: "El Dorado",                             duration: "2:21", durationSec: 141, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/mood.mp3",                                       cover: resolveCoverSrc("/capas/24kgoldn.jpg") },
  { id: 255, title: "High Hopes",                                  artist: "Panic! At The Disco",                       album: "Pray for the Wicked",                   duration: "3:10", durationSec: 190, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/high_hopes.mp3",                                  cover: resolveCoverSrc("/capas/panic.jpg") },
  { id: 256, title: "34+35",                                       artist: "Ariana Grande",                             album: "Positions",                             duration: "2:53", durationSec: 173, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/34_35.mp3",                                      cover: resolveCoverSrc("/capas/ariana.jpg") },
  { id: 257, title: "motive (with Doja Cat)",                      artist: "Ariana Grande, Doja Cat",                   album: "Positions",                             duration: "2:38", durationSec: 158, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/motive.mp3",                                   cover: resolveCoverSrc("/capas/ariana.jpg") },
  { id: 258, title: "boyfriend (with Social House)",               artist: "Ariana Grande, Social House",               album: "Thank U, Next",                         duration: "3:25", durationSec: 205, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/boyfriend.mp3",                                  cover: resolveCoverSrc("/capas/ariana.jpg") },
  { id: 259, title: "Billionaire (feat. Bruno Mars)",              artist: "Travis McCoy, Bruno Mars",                  album: "Lazarus",                               duration: "3:42", durationSec: 222, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/billionaire.mp3",                                 cover: resolveCoverSrc("/capas/travie_mccoy.jpg") },
  { id: 260, title: "Mirror",                                      artist: "Lil Wayne, Bruno Mars",                     album: "Tha Carter IV",                         duration: "4:05", durationSec: 245, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/mirror.mp3",                                     cover: resolveCoverSrc("/capas/lil_wayne.jpg") },
  { id: 261, title: "Lighters",                                    artist: "Bad Meets Evil, Bruno Mars",                album: "Hell: The Sequel",                      duration: "4:28", durationSec: 268, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/lighters.mp3",                                   cover: resolveCoverSrc("/capas/bad_meets_evil.jpg") },
  { id: 262, title: "7 Years",                                     artist: "Lukas Graham",                              album: "Lukas Graham (Blue Album)",             duration: "3:58", durationSec: 238, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/7_years.mp3",                                    cover: resolveCoverSrc("/capas/lukas_graham.jpg") },
  { id: 263, title: "I Gotta Feeling",                             artist: "Black Eyed Peas",                           album: "The E.N.D.",                            duration: "4:49", durationSec: 289, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/i_gotta_feeling.mp3",                            cover: resolveCoverSrc("/capas/black_eyed_peas.jpg") },
  { id: 264, title: "The Time (Dirty Bit)",                        artist: "Black Eyed Peas",                           album: "The Beginning",                         duration: "4:43", durationSec: 283, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/the_time_dirty_bit.mp3",                         cover: resolveCoverSrc("/capas/black_eyed_peas.jpg") },
  { id: 265, title: "Beautiful Girls",                             artist: "Sean Kingston",                             album: "Sean Kingston",                         duration: "3:13", durationSec: 193, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/beautiful_girls.mp3",                            cover: resolveCoverSrc("/capas/sean_kingston.jpg") },
  { id: 266, title: "See You Again (feat. Charlie Puth)",          artist: "Wiz Khalifa, Charlie Puth",                 album: "Furious 7 Soundtrack",                  duration: "3:50", durationSec: 230, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/see_you_again.mp3",                              cover: resolveCoverSrc("/capas/wiz_khalifa.jpg") },
  { id: 267, title: "menina solta",                                artist: "GIULIA BE",                                 album: "Singles",                               duration: "3:00", durationSec: 180, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/menina_solta.mp3",                                 cover: resolveCoverSrc("/capas/giulia_be.jpg") },
  { id: 268, title: "Coringa",                                     artist: "Jão",                                       album: "Pirata",                                duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/coringa.mp3",                                     cover: resolveCoverSrc("/capas/jao.jpg") },
  { id: 269, title: "Vou Morrer Sozinho",                          artist: "Jão",                                       album: "Pirata",                                duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/vou_morrer_sozinho.mp3",                           cover: resolveCoverSrc("/capas/jao.jpg") },
  { id: 270, title: "Reminder",                                    artist: "The Weeknd",                                album: "Starboy",                               duration: "3:39", durationSec: 219, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/reminder.mp3",                                   cover: resolveCoverSrc("/capas/the_weeknd.jpg") },
  { id: 271, title: "Die For You",                                 artist: "The Weeknd",                                album: "Starboy",                               duration: "4:20", durationSec: 260, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/die_for_you.mp3",                                 cover: resolveCoverSrc("/capas/the_weeknd.jpg") },
  { id: 272, title: "The Hills",                                   artist: "The Weeknd",                                album: "Beauty Behind the Madness",             duration: "3:42", durationSec: 222, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/the_hills.mp3",                                   cover: resolveCoverSrc("/capas/the_weeknd.jpg") },
  { id: 273, title: "Call Out My Name",                            artist: "The Weeknd",                                album: "My Dear Melancholy,",                   duration: "3:48", durationSec: 228, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/call_out_my_name.mp3",                           cover: resolveCoverSrc("/capas/the_weeknd.jpg") },
  { id: 274, title: "One Of The Girls (with JENNIE & Lily-Rose Depp)", artist: "The Weeknd, JENNIE, Lily-Rose Depp",  album: "The Idol",                              duration: "4:28", durationSec: 268, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/one_of_the_girls.mp3",                            cover: resolveCoverSrc("/capas/the_weeknd.jpg") },
  { id: 275, title: "Sinto sua falta (Ao Vivo)",                   artist: "Ferrugem",                                  album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/sinto_sua_falta_ao_vivo.mp3",                    cover: resolveCoverSrc("/capas/ferrugem.jpg") },
  { id: 276, title: "Até que enfim (Ao Vivo)",                     artist: "Ferrugem",                                  album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/ate_que_enfim_ao_vivo.mp3",                      cover: resolveCoverSrc("/capas/ferrugem.jpg") },
  { id: 277, title: "Tá na cara (Ao Vivo)",                        artist: "Ferrugem",                                  album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/ta_na_cara_ao_vivo.mp3",                         cover: resolveCoverSrc("/capas/ferrugem.jpg") },
  { id: 278, title: "Na Hora Da Raiva (Ao Vivo)",                  artist: "Henrique & Juliano",                        album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/na_hora_da_raiva_ao_vivo.mp3",                 cover: resolveCoverSrc("/capas/henrique_juliano.jpg") },
  { id: 279, title: "Amiga Linda",                                 artist: "João Bosco & Vinícius",                     album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/amiga_linda.mp3",                                 cover: resolveCoverSrc("/capas/joao_bosco_vinicius.jpg") },
  { id: 280, title: "Cobertor de Orelha (Ao Vivo)",                artist: "Turma do Pagode",                           album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cobertor_de_orelha_ao_vivo.mp3",                 cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 281, title: "Lancinho (Ao Vivo)",                          artist: "Turma do Pagode",                           album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/lancinho_ao_vivo.mp3",                           cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 282, title: "Deixa em Off (Ao Vivo)",                      artist: "Turma do Pagode",                           album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/deixa_em_off_ao_vivo.mp3",                     cover: resolveCoverSrc("/capas/turma_do_pagode.jpg") },
  { id: 283, title: "Car's Outside",                               artist: "James Arthur",                              album: "Singles",                               duration: "3:14", durationSec: 194, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/cars_outside.mp3",                               cover: resolveCoverSrc("/capas/james_arthur.jpg") },
  { id: 284, title: "Pra você acreditar (Ao Vivo)",                artist: "Ferrugem",                                  album: "Ao Vivo",                               duration: "4:00", durationSec: 240, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/pra_voce_acreditar_ao_vivo.mp3",                 cover: resolveCoverSrc("/capas/ferrugem.jpg") },
  { id: 285, title: "Minha namorada",                              artist: "Ferrugem",                                  album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/minha_namorada.mp3",                              cover: resolveCoverSrc("/capas/ferrugem.jpg") },
  { id: 286, title: "Shape of You",                                artist: "Ed Sheeran",                                album: "÷ (Divide)",                            duration: "3:54", durationSec: 234, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/shape_of_you.mp3",                               cover: resolveCoverSrc("/capas/ed_sheeran.jpg") },
  { id: 287, title: "Havana (feat. Young Thug)",                   artist: "Camila Cabello, Young Thug",                album: "Camila",                                duration: "3:37", durationSec: 217, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/havana.mp3",                                     cover: resolveCoverSrc("/capas/camila_cabello.jpg") },
  { id: 288, title: "Te Assumi Pro Brasil (Ao Vivo)",              artist: "Matheus & Kauan",                           album: "Ao Vivo",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/te_assumi_pro_brasil_ao_vivo.mp3",               cover: resolveCoverSrc("/capas/matheus_kauan.jpg") },
  { id: 289, title: "Os Anjos Cantam",                             artist: "Jorge & Mateus",                            album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/os_anjos_cantam.mp3",                            cover: resolveCoverSrc("/capas/jorge_mateus.jpg") },
  { id: 290, title: "Nocaute",                                     artist: "Jorge & Mateus",                            album: "Singles",                               duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/nocaute.mp3",                                    cover: resolveCoverSrc("/capas/jorge_mateus.jpg") },
  { id: 291, title: "We Don't Talk Anymore (feat. Selena Gomez)",  artist: "Charlie Puth, Selena Gomez",                album: "Nine Track Mind",                       duration: "3:38", durationSec: 218, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/we_dont_talk_anymore.mp3",                      cover: resolveCoverSrc("/capas/charlie_puth.jpg") },
  { id: 292, title: "Attention",                                   artist: "Charlie Puth",                              album: "Voicenotes",                            duration: "3:29", durationSec: 209, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/attention.mp3",                                  cover: resolveCoverSrc("/capas/charlie_puth.jpg") },
  { id: 293, title: "Demons",                                      artist: "Imagine Dragons",                           album: "Night Visions",                         duration: "2:57", durationSec: 177, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/demons.mp3",                                     cover: resolveCoverSrc("/capas/imagine_dragons.jpg") },
  { id: 294, title: "I Ain't Worried",                             artist: "OneRepublic",                               album: "Top Gun: Maverick OST",                 duration: "2:40", durationSec: 160, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/i_aint_worried.mp3",                             cover: resolveCoverSrc("/capas/onerepublic.jpg") },
  { id: 295, title: "Señorita",                                    artist: "Shawn Mendes, Camila Cabello",               album: "Singles",                               duration: "3:14", durationSec: 194, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/senorita.mp3",                                   cover: resolveCoverSrc("/capas/shawn_mendes.jpg") },
  { id: 296, title: "There's Nothing Holdin' Me Back",             artist: "Shawn Mendes",                              album: "Illuminate",                            duration: "3:28", durationSec: 208, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/theres_nothing_holding_me_back.mp3",             cover: resolveCoverSrc("/capas/shawn_mendes.jpg") },
  { id: 297, title: "Stitches",                                    artist: "Shawn Mendes",                              album: "Handwritten",                           duration: "3:03", durationSec: 183, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/stitches.mp3",                                   cover: resolveCoverSrc("/capas/shawn_mendes.jpg") },
  { id: 298, title: "Paradise",                                    artist: "Coldplay",                                  album: "Mylo Xyloto",                           duration: "4:38", durationSec: 278, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/paradise.mp3",                                   cover: resolveCoverSrc("/capas/coldplay.jpg") },
  { id: 299, title: "Am I Wrong",                                  artist: "Camila Cabello, Nicholas Galitzine,...",     album: "Cinderella OST",                        duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/am_i_wrong_cinderella.mp3",                      cover: resolveCoverSrc("/capas/camila_cabello.jpg") },
  { id: 300, title: "Perfect",                                     artist: "Camila Cabello, Nicholas Galitzine",        album: "Cinderella OST",                        duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/perfect_cinderella.mp3",                         cover: resolveCoverSrc("/capas/camila_cabello.jpg") },
  { id: 301, title: "Million To One (Remix)",                      artist: "Camila Cabello, Jonah Shy",                 album: "Cinderella OST",                        duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/million_to_one_remix.mp3",                       cover: resolveCoverSrc("/capas/camila_cabello.jpg") },
  { id: 302, title: "Million To One",                              artist: "Camila Cabello",                            album: "Cinderella OST",                        duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/million_to_one.mp3",                             cover: resolveCoverSrc("/capas/camila_cabello.jpg") },
  { id: 303, title: "Hey Brother",                                 artist: "Avicii",                                    album: "True",                                  duration: "5:43", durationSec: 343, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/hey_brother.mp3",                                 cover: resolveCoverSrc("/capas/avicii.jpg") },
  { id: 304, title: "It Will Rain",                                artist: "Bruno Mars",                                album: "Doo-Wops & Hooligans",                  duration: "4:09", durationSec: 249, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/it_will_rain.mp3",                               cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 305, title: "Blast Off",                                   artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "4:29", durationSec: 269, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/blast_off.mp3",                                  cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 306, title: "Love's Train",                                artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "3:30", durationSec: 210, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/loves_train.mp3",                                 cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 307, title: "Skate",                                       artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "3:28", durationSec: 208, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/skate.mp3",                                      cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 308, title: "777",                                         artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "2:58", durationSec: 178, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/777.mp3",                                        cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 309, title: "Put On A Smile",                              artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "4:09", durationSec: 249, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/put_on_a_smile.mp3",                             cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 310, title: "Smokin Out The Window",                       artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "3:38", durationSec: 218, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/smokin_out_the_window.mp3",                      cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 311, title: "After Last Night (with Thundercat)",          artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "3:23", durationSec: 203, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/after_last_night.mp3",                           cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 312, title: "Fly As Me",                                   artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "2:34", durationSec: 154, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/fly_as_me.mp3",                                  cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 313, title: "Leave The Door Open",                         artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "4:02", durationSec: 242, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/leave_the_door_open.mp3",                        cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 314, title: "Silk Sonic Intro",                            artist: "Bruno Mars, Anderson .Paak, Silk Sonic",    album: "An Evening with Silk Sonic",            duration: "1:27", durationSec: 87,  src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/silk_sonic_intro.mp3",                           cover: resolveCoverSrc("/capas/silk_sonic.jpg") },
  { id: 315, title: "Talking to the Moon (Acoustic)",             artist: "Bruno Mars",                                album: "Doo-Wops & Hooligans",                  duration: "3:35", durationSec: 215, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/talking_to_the_moon_acoustic.mp3",               cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 316, title: "The Other Side (feat. CeeLo Green & B.o.B)", artist: "Bruno Mars, B.o.B, CeeLo Green",           album: "Doo-Wops & Hooligans",                  duration: "3:14", durationSec: 194, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/the_other_side.mp3",                             cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 317, title: "Count on Me",                                 artist: "Bruno Mars",                                album: "Doo-Wops & Hooligans",                  duration: "3:18", durationSec: 198, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/count_on_me.mp3",                                 cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 318, title: "Liquor Store Blues (feat. Damian Marley)",   artist: "Bruno Mars, Damian Marley",                 album: "Doo-Wops & Hooligans",                  duration: "3:52", durationSec: 232, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/liquor_store_blues.mp3",                         cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 319, title: "Marry You",                                   artist: "Bruno Mars",                                album: "Doo-Wops & Hooligans",                  duration: "3:51", durationSec: 231, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/marry_you.mp3",                                   cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 320, title: "The Lazy Song",                               artist: "Bruno Mars",                                album: "Doo-Wops & Hooligans",                  duration: "3:09", durationSec: 189, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/the_lazy_song.mp3",                               cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 321, title: "Grenade",                                     artist: "Bruno Mars",                                album: "Doo-Wops & Hooligans",                  duration: "3:42", durationSec: 222, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/grenade.mp3",                                    cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 322, title: "Too Good to Say Goodbye",                     artist: "Bruno Mars",                                album: "24K Magic",                             duration: "4:02", durationSec: 242, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/too_good_to_say_goodbye.mp3",                     cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 323, title: "Finesse",                                     artist: "Bruno Mars",                                album: "24K Magic",                             duration: "3:26", durationSec: 206, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/finesse.mp3",                                    cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 324, title: "Calling All My Lovelies",                     artist: "Bruno Mars",                                album: "24K Magic",                             duration: "3:43", durationSec: 223, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/calling_all_my_lovelies.mp3",                     cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 325, title: "Straight up & Down",                          artist: "Bruno Mars",                                album: "24K Magic",                             duration: "3:38", durationSec: 218, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/straight_up_and_down.mp3",                        cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 326, title: "Versace on the Floor",                        artist: "Bruno Mars",                                album: "24K Magic",                             duration: "4:14", durationSec: 254, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/versace_on_the_floor.mp3",                        cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 327, title: "Perm",                                        artist: "Bruno Mars",                                album: "24K Magic",                             duration: "3:37", durationSec: 217, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/perm.mp3",                                       cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 328, title: "Chunky",                                      artist: "Bruno Mars",                                album: "24K Magic",                             duration: "3:12", durationSec: 192, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/chunky.mp3",                                     cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 329, title: "24K Magic",                                   artist: "Bruno Mars",                                album: "24K Magic",                             duration: "3:46", durationSec: 226, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/24k_magic.mp3",                                  cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 330, title: "If I Knew",                                   artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "4:09", durationSec: 249, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/if_i_knew.mp3",                                   cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
  { id: 331, title: "Money Make Her Smile",                        artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "3:27", durationSec: 207, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/money_make_her_smile.mp3",                        cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
  { id: 332, title: "Show Me",                                     artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "3:14", durationSec: 194, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/show_me.mp3",                                    cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
  { id: 333, title: "Natalie",                                     artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "3:45", durationSec: 225, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/natalie.mp3",                                    cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
  { id: 334, title: "Moonshine",                                   artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "3:47", durationSec: 227, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/moonshine.mp3",                                   cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
  { id: 335, title: "Treasure",                                    artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "2:59", durationSec: 179, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/treasure.mp3",                                   cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
  { id: 336, title: "Gorilla",                                     artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "4:02", durationSec: 242, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/gorilla.mp3",                                    cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
  { id: 337, title: "Young Girls",                                 artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "4:04", durationSec: 244, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/young_girls.mp3",                                 cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
  { id: 338, title: "Talking to the Moon",                         artist: "Bruno Mars",                                album: "Doo-Wops & Hooligans",                  duration: "3:35", durationSec: 215, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/talking_to_the_moon.mp3",                         cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 339, title: "That's What I Like",                          artist: "Bruno Mars",                                album: "24K Magic",                             duration: "3:28", durationSec: 208, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/thats_what_i_like.mp3",                         cover: resolveCoverSrc("/capas/24k_magic.jpg") },
  { id: 340, title: "When I Was Your Man",                         artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "3:33", durationSec: 213, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/when_i_was_your_man.mp3",                         cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
  { id: 341, title: "Just the Way You Are",                        artist: "Bruno Mars",                                album: "Doo-Wops & Hooligans",                  duration: "3:40", durationSec: 220, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/just_the_way_you_are.mp3",                        cover: resolveCoverSrc("/capas/doo_wops.jpg") },
  { id: 342, title: "Locked out of Heaven",                        artist: "Bruno Mars",                                album: "Unorthodox Jukebox",                    duration: "3:53", durationSec: 233, src: "https://pub-16acc94c13574b2e8e6d661ccb3ff53e.r2.dev/locked_out_of_heaven.mp3",                        cover: resolveCoverSrc("/capas/unorthodox_jukebox.jpg") },
];

const ARTIST_COLORS: Record<string, string> = {
  "Bruno Mars":          "#1db954",
  "Sabrina Carpenter":   "#e8a0c0",
  "Britney Spears":      "#c0392b",
  "Maroon 5":            "#e74c3c",
  "The Weeknd":          "#8e44ad",
  "Ariana Grande":       "#d35400",
  "Taylor Swift":        "#27ae60",
  "Luan Santana":        "#2980b9",
  "Marília Mendonça":    "#a855f7",
  "Turma do Pagode":     "#16a085",
  "Henrique & Juliano":  "#e67e22",
  "Jorge & Mateus":      "#2ecc71",
  "Ferrugem":            "#f59e0b",
  "Zé Neto & Cristiano": "#ef4444",
  "Black Eyed Peas":     "#64748b",
  "Lady Gaga":           "#9b59b6",
  "Jason Derulo":        "#1abc9c",
  "Rihanna":             "#e74c3c",
  "Dua Lipa":            "#8b5cf6",
  "Justin Bieber":       "#f39c12",
  "Ed Sheeran":          "#e67e22",
  "Camila Cabello":      "#e91e63",
  "Avicii":              "#f1c40f",
  "Shawn Mendes":        "#06b6d4",
  "Coldplay":            "#3b82f6",
  "Imagine Dragons":     "#dc2626",
  "Harry Styles":        "#f472b6",
};

function trackColor(t: Track) {
  for (const [key, color] of Object.entries(ARTIST_COLORS)) {
    if (t.artist.includes(key)) return color;
  }
  return "#1db954";
}

function fmtSec(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Build artist list from actual TRACKS data ─────────────────────────────
function buildArtistList() {
  const map = new Map<string, number>();
  TRACKS.forEach(t => {
    // Use the full artist string as key so "Bruno Mars" matches "Bruno Mars, Anderson .Paak..."
    // But also extract primary artist for grouping
    const primary = t.artist.split(",")[0].trim();
    map.set(primary, (map.get(primary) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, count]) => ({
      name,
      count,
      color: (() => {
        for (const [key, color] of Object.entries(ARTIST_COLORS)) {
          if (key.includes(name) || name.includes(key)) return color;
        }
        return "#888";
      })(),
    }))
    .sort((a, b) => b.count - a.count);
}

const ARTIST_LIST = buildArtistList();

// ─── SVG icons ───────────────────────────────────────────────────────────────
const IcoPlay  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>;
const IcoPause = () => <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const IcoPrev  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>;
const IcoNext  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/></svg>;
const IcoShuffle = () => <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>;
const IcoRepeat  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>;
const IcoVol     = () => <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>;
const IcoClose   = () => <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const IcoMenu    = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>;
const IcoMusic   = () => <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>;
const IcoSearch  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>;

// ─── component ───────────────────────────────────────────────────────────────
type Props = { onClose?: () => void };

export default function SpotifyPlayer({ onClose }: Props) {
  const [currentId, setCurrentId]     = useState<number | null>(null);
  const [playing, setPlaying]         = useState(false);
  const [progress, setProgress]       = useState(0);
  const [volume, setVolume]           = useState(0.8);
  const [shuffle, setShuffle]         = useState(false);
  const [repeat, setRepeat]           = useState(false);
  const [search, setSearch]           = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [artistFilter, setArtistFilter] = useState<string | null>(null);
  const [artistSearch, setArtistSearch] = useState("");
  const [playedIds, setPlayedIds]     = useState<Set<number>>(new Set());

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS.find(t => t.id === currentId) ?? null;
  const accentColor  = currentTrack ? trackColor(currentTrack) : "#8b5cf6";

  // ── filtering ─────────────────────────────────────────────────────────────
  // artistFilter matches against FULL artist string (covers features)
  const filtered = TRACKS.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) || t.album.toLowerCase().includes(q);
    const matchArtist = !artistFilter || t.artist.toLowerCase().includes(artistFilter.toLowerCase());
    return matchSearch && matchArtist;
  });

  const filteredArtists = ARTIST_LIST.filter(a =>
    !artistSearch || a.name.toLowerCase().includes(artistSearch.toLowerCase())
  );

  // ── audio ─────────────────────────────────────────────────────────────────
  // ÚNICO responsável por trocar a src e (re)carregar o áudio.
  // Antes havia um segundo caminho (playAudio) que também setava a src e
  // chamava .play() imediatamente; quando esse efeito rodava em seguida ele
  // disparava audio.load() de novo, cancelando o carregamento em andamento
  // e fazendo a música parecer travar por vários segundos. Agora só existe
  // este lugar.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    const resolvedSrc = resolveAudioSrc(currentTrack.src);
    if (audio.src !== resolvedSrc) {
      audio.src = resolvedSrc;
      audio.load();
    }
    setProgress(0);
  }, [currentId]); // eslint-disable-line

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [playing, currentId]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    setProgress(a.currentTime / a.duration);
  };

  const playNext = useCallback(() => {
    if (!filtered.length) return;
    if (repeat && currentId !== null) {
      const a = audioRef.current;
      if (a) { a.currentTime = 0; a.play().catch(() => {}); }
      return;
    }
    if (shuffle) {
      const pool = filtered.map(t => t.id);
      const remaining = pool.filter(id => id !== currentId && !playedIds.has(id));
      const candidates = remaining.length ? remaining : pool.filter(id => id !== currentId);
      if (!candidates.length) return;
      const nextId = candidates[Math.floor(Math.random() * candidates.length)];
      setPlayedIds(prev => new Set([...prev, nextId]));
      setCurrentId(nextId);
    } else {
      const idx = filtered.findIndex(t => t.id === currentId);
      const next = filtered[(idx + 1) % filtered.length];
      setCurrentId(next.id);
    }
    setPlaying(true);
  }, [currentId, shuffle, repeat, playedIds, filtered]);

  const playPrev = () => {
    const idx = filtered.findIndex(t => t.id === currentId);
    if (idx <= 0) return;
    setCurrentId(filtered[idx - 1].id);
    setPlaying(true);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - rect.left) / rect.width) * a.duration;
  };

  // Agora só mexe em estado — quem carrega e toca o áudio é o useEffect acima.
  const selectTrack = (t: Track) => {
    if (t.id === currentId) { setPlaying(p => !p); return; }
    setCurrentId(t.id);
    setPlaying(true);
    setPlayedIds(new Set([t.id]));
  };

  // ── banner buttons ─────────────────────────────────────────────────────────
  // SHUFFLE (left) — starts random from current filtered list
  const handlePlayShuffle = () => {
    const pool = filtered.length ? filtered : TRACKS;
    setShuffle(true);
    const firstTrack = pool[Math.floor(Math.random() * pool.length)];
    setPlayedIds(new Set([firstTrack.id]));
    setCurrentId(firstTrack.id);
    setPlaying(true);
  };

  // PLAY (right) — starts in order from current filtered list
  const handlePlayInOrder = () => {
    setShuffle(false);
    setPlayedIds(new Set());
    const pool = filtered.length ? filtered : TRACKS;
    if (!currentId || !filtered.find(t => t.id === currentId)) {
      setCurrentId(pool[0].id);
      setPlaying(true);
    } else {
      setPlaying(p => !p);
    }
  };

  const toggleShuffle = () => {
    setShuffle(s => { if (!s) setPlayedIds(currentId ? new Set([currentId]) : new Set()); return !s; });
  };

  const handleArtistFilter = (name: string | null) => {
    setArtistFilter(name);
    setSidebarOpen(false);
  };

  const bannerBg = `linear-gradient(180deg, #0d0d0d 0%, ${accentColor}28 55%, ${accentColor}55 100%)`;

  return (
    <div style={S.root}>
      <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={playNext} preload="auto" />

      {sidebarOpen && <div style={S.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* ─── SIDEBAR: filtro por artista ─────────────────────────────────── */}
      <aside style={{ ...S.sidebar, bottom: currentTrack ? 90 : 0, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={S.sideTop}>
  <div style={S.sideLogo}>
    <div style={{ ...S.sideLogoIcon, background: accentColor }}><IcoMusic /></div>
    <span style={S.sideLogoText}>MusicPlayer</span>
  </div>
  <button style={S.sairBtn} onClick={onClose}>Sair</button>
  <button style={S.iconBtn} onClick={() => setSidebarOpen(false)}><IcoClose /></button>
</div>

        <div style={S.sideSearchWrap}>
          <span style={{ color: "#555", display: "flex" }}><IcoSearch /></span>
          <input
            style={S.sideSearchInput}
            placeholder="Buscar artista..."
            value={artistSearch}
            onChange={e => setArtistSearch(e.target.value)}
          />
        </div>

        <div style={S.sideLabel}>FILTRAR POR ARTISTA</div>

        {/* "All" row */}
        <div
          style={{ ...S.artistRow, borderLeft: `3px solid ${artistFilter === null ? accentColor : "transparent"}`, background: artistFilter === null ? `${accentColor}14` : "transparent" }}
          onClick={() => handleArtistFilter(null)}
        >
          <div style={{ ...S.artistDot, background: accentColor }} />
          <span style={{ ...S.artistName, color: artistFilter === null ? "#fff" : "#999", fontWeight: artistFilter === null ? 600 : 400 }}>
            Todas as músicas
          </span>
          <span style={S.artistBadge}>{TRACKS.length}</span>
        </div>

        <div style={{ flex: 1, overflowY: "auto" as const }}>
          {filteredArtists.map(a => (
            <div
              key={a.name}
              style={{ ...S.artistRow, borderLeft: `3px solid ${artistFilter === a.name ? a.color : "transparent"}`, background: artistFilter === a.name ? `${a.color}14` : "transparent" }}
              onClick={() => handleArtistFilter(a.name)}
            >
              <div style={{ ...S.artistDot, background: a.color }} />
              <span style={{ ...S.artistName, color: artistFilter === a.name ? "#fff" : "#888", fontWeight: artistFilter === a.name ? 600 : 400 }}>
                {a.name}
              </span>
              <span style={S.artistBadge}>{a.count}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ─── MAIN ────────────────────────────────────────────────────────── */}
      <main style={{ ...S.main, marginBottom: currentTrack ? 90 : 0 }}>
        {/* topbar */}
        <div style={S.topBar}>
          <button style={S.menuBtn} onClick={() => setSidebarOpen(true)} title="Filtrar artistas">
            <IcoMenu />
          </button>
          <div style={S.searchBox}>
            <span style={{ color: "#555", display: "flex", flexShrink: 0 }}><IcoSearch /></span>
            <input
              style={S.searchInput}
              placeholder="Buscar música, artista ou álbum..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button style={{ ...S.iconBtn, color: "#555" }} onClick={() => setSearch("")}><IcoClose /></button>
            )}
          </div>
        </div>

        {/* BANNER — only info, no buttons */}
        <div style={{ ...S.banner, background: bannerBg }}>
         <div style={S.bannerArt}>
  <img
    key={currentTrack ? currentTrack.id : "default"}
    src={currentTrack ? resolveCoverSrc(currentTrack.cover) : resolveCoverSrc("/capas/capa_padrao.jpg")}
    style={{ width: "100%", height: "100%", objectFit: "cover" as const, borderRadius: 10 }}
    alt=""
    onError={e => { (e.target as HTMLImageElement).src = resolveCoverSrc("/capas/capa_padrao.jpg"); }}
  />
</div>
          <div style={S.bannerMeta}>
            <span style={S.bannerTag}>PLAYLIST PESSOAL</span>
            <h1 style={S.bannerTitle}>{artistFilter ?? "Minhas Músicas"}</h1>
            <span style={S.bannerCount}>
              {filtered.length} músicas
              {artistFilter && (
                <span style={S.clearBtn} onClick={() => setArtistFilter(null)}>✕ limpar</span>
              )}
            </span>
          </div>
        </div>

        {/* ACTION BAR — shuffle LEFT, play RIGHT (como Spotify) */}
        <div style={S.actionBar}>
  {/* spacer empurra os botões pra direita */}
  <div style={{ flex: 1 }} />

  <button
    style={{ ...S.actionShuffle, color: shuffle ? accentColor : "#888", borderColor: shuffle ? accentColor : "#2a2a2a", marginRight: 10 }}
    onClick={handlePlayShuffle}
    title="Aleatório"
  >
    <IcoShuffle />
    <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.3 }}>Aleatório</span>
  </button>

  <button
    style={{ ...S.actionPlay, background: accentColor }}
    onClick={handlePlayInOrder}
    title="Reproduzir"
  >
    {playing && !shuffle ? <IcoPause /> : <IcoPlay />}
  </button>
</div>

        {/* table header */}
        <div style={S.tableHead}>
          <span style={{ width: 42, textAlign: "center" as const }}>#</span>
          <span style={{ flex: 2 }}>TÍTULO</span>
          <span className="hide-sm" style={{ flex: 1.5 }}>ARTISTA</span>
          <span className="hide-md" style={{ flex: 1.5 }}>ÁLBUM</span>
          <span style={{ width: 52, textAlign: "right" as const }}>⏱</span>
        </div>

        {/* track list */}
        <div style={S.list}>
          {filtered.length === 0 ? (
            <div style={S.empty}>
              <IcoMusic /><span style={{ color: "#444", fontSize: 14 }}>Nenhuma música encontrada</span>
            </div>
          ) : filtered.map((t, i) => {
            const active = t.id === currentId;
            const col    = trackColor(t);
            return (
              <div
                key={t.id}
                style={{ ...S.row, background: active ? `${col}12` : "transparent", borderLeft: `3px solid ${active ? col : "transparent"}` }}
                onClick={() => selectTrack(t)}
              >
                <span style={{ width: 42, textAlign: "center" as const, color: active ? col : "#444", fontSize: active && playing ? 16 : 12, fontWeight: 700 }}>
                  {active && playing ? "♫" : i + 1}
                </span>
                <div style={{ flex: 2, display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{ ...S.thumb, background: `${col}22` }}>
                    <img src={resolveCoverSrc(t.cover)} style={{ width: "100%", height: "100%", objectFit: "cover" as const, borderRadius: 4 }} alt="" onError={e => { (e.target as HTMLImageElement).src = resolveCoverSrc("/capas/capa_padrao.jpg"); }} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ color: active ? col : "#e0e0e0", fontWeight: active ? 700 : 500, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{t.title}</div>
                    <div style={{ color: "#666", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{t.artist}</div>
                  </div>
                </div>
                <span className="hide-sm" style={{ flex: 1.5, color: "#777", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, paddingRight: 8 }}>{t.artist}</span>
                <span className="hide-md" style={{ flex: 1.5, color: "#4a4a4a", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{t.album}</span>
                <span style={{ width: 52, textAlign: "right" as const, color: "#555", fontSize: 12 }}>{t.duration}</span>
              </div>
            );
          })}
        </div>
      </main>

      {/* ─── PLAYER BAR ──────────────────────────────────────────────────── */}
      {currentTrack && (
      <div style={S.bar}>
        {/* now playing */}
        <div style={S.np}>
          {currentTrack ? (
            <>
              <div style={{ ...S.npImg, border: `1.5px solid ${accentColor}44` }}>
                <img
                  key={currentTrack.id}
                  src={resolveCoverSrc(currentTrack.cover)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" as const, borderRadius: 7 }}
                  alt=""
                  onError={e => { (e.target as HTMLImageElement).src = resolveCoverSrc("/capas/capa_padrao.jpg"); }}
                />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ color: "#f0f0f0", fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{currentTrack.title}</div>
                <div style={{ color: "#777", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{currentTrack.artist}</div>
              </div>
            </>
          ) : (
            <div style={{ color: "#333", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}><span style={{ color: "#222" }}><IcoMusic /></span><span style={{ color: "#444" }}>Nenhuma música</span></div>
          )}
        </div>

        {/* center controls */}
        <div style={S.center}>
          <div style={S.ctrls}>
            <button className="hide-sm" style={{ ...S.ctrlBtn, color: shuffle ? accentColor : "#444" }} onClick={toggleShuffle}><IcoShuffle /></button>
            <button style={S.ctrlBtn} onClick={playPrev}><IcoPrev /></button>
            <button style={{ ...S.playBtn, background: currentTrack ? accentColor : "#1a1a1a" }} onClick={() => { if (!currentId) { setCurrentId((filtered[0] ?? TRACKS[0]).id); setPlaying(true); } else setPlaying(p => !p); }}>
              {playing ? <IcoPause /> : <IcoPlay />}
            </button>
            <button style={S.ctrlBtn} onClick={playNext}><IcoNext /></button>
            <button className="hide-sm" style={{ ...S.ctrlBtn, color: repeat ? accentColor : "#444" }} onClick={() => setRepeat(r => !r)}><IcoRepeat /></button>
          </div>
          <div style={S.prog}>
            <span style={S.time}>{currentTrack && audioRef.current ? fmtSec(audioRef.current.currentTime) : "0:00"}</span>
            <div style={S.progBg} onClick={seek}>
              <div style={{ ...S.progFill, width: `${progress * 100}%`, background: accentColor }} />
              <div style={{ ...S.progThumb, left: `calc(${progress * 100}% - 5px)`, background: accentColor }} />
            </div>
            <span style={S.time}>{currentTrack?.duration ?? "0:00"}</span>
          </div>
        </div>

        {/* volume */}
        <div style={S.vol} className="hide-sm">
          <span style={{ color: "#444", display: "flex" }}><IcoVol /></span>
          <div style={S.volTrack}>
            <div style={{ ...S.volFill, width: `${volume * 100}%`, background: accentColor }} />
            <input type="range" min={0} max={1} step={0.01} value={volume} onChange={e => setVolume(parseFloat(e.target.value))} style={S.volInput} />
          </div>
        </div>
      </div>
      )}

      <style>{`
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#222;border-radius:3px}
        input[type=range]{-webkit-appearance:none;background:transparent;outline:none;cursor:pointer}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:11px;height:11px;border-radius:50%;background:#fff;margin-top:-4px}
        input[type=range]::-webkit-slider-runnable-track{height:3px;border-radius:2px;background:transparent}
        .hide-sm,.hide-md{display:flex!important}
        @media(max-width:900px){.hide-md{display:none!important}}
        @media(max-width:640px){.hide-sm{display:none!important}}
      `}</style>
    </div>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root:    { position:"fixed", inset:0, display:"flex", flexDirection:"column", background:"#0a0a0a", color:"#fff", fontFamily:"'Helvetica Neue',Arial,sans-serif", zIndex:9999, overflow:"hidden" },
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:10500, backdropFilter:"blur(6px)" },

  // sidebar
  sidebar:        { position:"fixed", left:0, top:0, bottom:90, width:270, background:"#0c0c0c", borderRight:"1px solid #181818", display:"flex", flexDirection:"column", zIndex:11000, transition:"transform 0.26s cubic-bezier(.4,0,.2,1)", overflow:"hidden" },
  sideTop:        { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 14px 14px", borderBottom:"1px solid #181818", flexShrink:0 },
  sideLogo:       { display:"flex", alignItems:"center", gap:10 },
  sideLogoIcon:   { width:32, height:32, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#000", flexShrink:0 },
  sideLogoText:   { fontWeight:800, fontSize:14, letterSpacing:"-0.3px" },
  sideSearchWrap: { display:"flex", alignItems:"center", gap:8, margin:"10px 12px 6px", background:"#181818", borderRadius:8, padding:"7px 11px", flexShrink:0 },
  sideSearchInput:{ flex:1, background:"none", border:"none", color:"#ccc", fontSize:13, outline:"none" },
  sideLabel:      { padding:"10px 14px 6px", fontSize:9, fontWeight:700, letterSpacing:1.8, color:"#333", textTransform:"uppercase" as const, flexShrink:0 },
  artistRow:      { display:"flex", alignItems:"center", gap:10, padding:"8px 14px", cursor:"pointer", transition:"background 0.12s" },
  artistDot:      { width:7, height:7, borderRadius:"50%", flexShrink:0 },
  artistName:     { flex:1, fontSize:13, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" as const },
  artistBadge:    { fontSize:11, color:"#333", fontWeight:700, minWidth:18, textAlign:"right" as const },
  sairBtn: { background: "none", border: "1px solid #2a2a2a", borderRadius: 14, padding: "5px 12px", color: "#aaa", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 },

  // main
  main:      { flex:1, overflowY:"auto", marginBottom:90, display:"flex", flexDirection:"column" },
  topBar:    { display:"flex", alignItems:"center", gap:10, padding:"12px 18px", position:"sticky", top:0, background:"#0a0a0add", backdropFilter:"blur(20px)", zIndex:10, borderBottom:"1px solid #111", flexShrink:0 },
  menuBtn:   { background:"none", border:"none", cursor:"pointer", color:"#777", padding:"5px", display:"flex", alignItems:"center", borderRadius:6, flexShrink:0 },
  searchBox: { flex:1, display:"flex", alignItems:"center", gap:8, background:"#141414", border:"1px solid #1e1e1e", borderRadius:10, padding:"7px 13px" },
  searchInput:{ flex:1, background:"none", border:"none", color:"#ddd", fontSize:13, outline:"none" },
  iconBtn:   { background:"none", border:"none", cursor:"pointer", color:"#888", padding:4, display:"flex", alignItems:"center", borderRadius:4 },

  // banner — image + text only, NO buttons
  banner:    { display:"flex", alignItems:"center", gap:20, padding:"22px 22px 14px", flexShrink:0 },
  bannerArt: { width:96, height:96, borderRadius:10, background:"#181818", border:"1px solid #1e1e1e", display:"flex", alignItems:"center", justifyContent:"center", color:"#2a2a2a", flexShrink:0 },
  bannerMeta:{ display:"flex", flexDirection:"column", gap:3 },
  bannerTag: { fontSize:10, fontWeight:700, color:"#444", letterSpacing:2, textTransform:"uppercase" as const },
  bannerTitle:{ fontSize:34, fontWeight:900, margin:0, lineHeight:1.1, letterSpacing:"-0.5px", color:"#efefef" },
  bannerCount:{ color:"#555", fontSize:13, display:"flex", alignItems:"center", gap:10 },
  clearBtn:  { color:"#666", fontSize:11, cursor:"pointer", background:"#181818", padding:"2px 8px", borderRadius:4 },

  // action bar — shuffle LEFT, play RIGHT
  actionBar:     { display:"flex", alignItems:"center", padding:"10px 22px 6px", flexShrink:0 },
  actionShuffle: { display:"flex", alignItems:"center", gap:5, background:"transparent", border:"1.5px solid", borderRadius:20, padding:"8px 8px", cursor:"pointer", transition:"all .15s", fontFamily:"inherit" },
  actionPlay:    { width:50, height:50, borderRadius:"50%", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#000", flexShrink:0, boxShadow:"0 4px 18px rgba(0,0,0,0.5)", transition:"transform .1s" },

  // table
  tableHead: { display:"flex", alignItems:"center", padding:"6px 18px", borderTop:"1px solid #141414", borderBottom:"1px solid #141414", color:"#2e2e2e", fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" as const, flexShrink:0 },
  list:      { padding:"4px 0 8px" },
  row:       { display:"flex", alignItems:"center", padding:"7px 18px", cursor:"pointer", transition:"background .1s" },
  thumb:     { width:36, height:36, borderRadius:4, flexShrink:0, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" },
  empty:     { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, padding:"60px 0", color:"#333" },

  // player bar
  bar:    { position:"fixed", bottom:0, left:0, right:0, height:90, background:"#0c0c0c", borderTop:"1px solid #181818", display:"flex", alignItems:"center", padding:"0 18px", gap:14, zIndex:1000 },
  np:     { display:"flex", alignItems:"center", gap:11, flex:1, minWidth:0 },
  npImg:  { width:50, height:50, borderRadius:8, flexShrink:0, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" },
  center: { flex:2, display:"flex", flexDirection:"column", alignItems:"center", gap:5, minWidth:0 },
  ctrls:  { display:"flex", alignItems:"center", gap:18 },
  ctrlBtn:{ background:"none", border:"none", cursor:"pointer", color:"#444", display:"flex", alignItems:"center", padding:0, transition:"color .15s" },
  playBtn:{ width:38, height:38, borderRadius:"50%", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#000", flexShrink:0 },
  prog:   { display:"flex", alignItems:"center", gap:8, width:"100%" },
  time:   { color:"#3a3a3a", fontSize:10, minWidth:30, textAlign:"center" as const },
  progBg: { flex:1, height:3, background:"#1e1e1e", borderRadius:2, cursor:"pointer", position:"relative" },
  progFill:{ height:"100%", borderRadius:2, transition:"width .2s linear" },
  progThumb:{ position:"absolute", top:-4, width:10, height:10, borderRadius:"50%", pointerEvents:"none" as const },
  vol:    { display:"flex", alignItems:"center", gap:8, flex:1, justifyContent:"flex-end", minWidth:120 },
  volTrack:{ width:90, height:3, background:"#1e1e1e", borderRadius:2, position:"relative" },
  volFill:{ height:"100%", borderRadius:2, position:"absolute", top:0, left:0, pointerEvents:"none" as const },
  volInput:{ position:"absolute", inset:"-7px 0", width:"100%", opacity:0, cursor:"pointer" },
};