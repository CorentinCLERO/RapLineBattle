"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type songList = {
  artist: string;
  songs: {
    id: string;
    song_name: string;
  }[];
}[];

function Page() {
  const searchParams = useSearchParams();
  const [songsList, setSongsList] = useState<songList | null>(null);
  const [songsListFiltered, setSongsListFiltered] = useState<songList | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [textDificulty, setTextDificulty] = useState<string | null>(null);
  const [isLoadingAddSong, setIsLoadingAddSong] = useState<boolean>(false);
  const [selectDifficulty, setSelectDifficulty] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const search = searchParams?.get("search") || "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTextDificulty(localStorage.getItem("textDifficulty") || null);
    }
  }, []);

  useEffect(() => {
    fetch("/api/songsList")
      .then((res) => res.json())
      .then((res) => setSongsList(res))
      .catch(() => console.error("Echec de la requête"))
      .finally(() => setIsFetching(false));
  }, []);

  useEffect(() => {
    if (!songsList) {
      setSongsListFiltered(null);
      return;
    }

    const searchLower = search.toLowerCase();

    // Vérifie si la recherche correspond à un artiste
    const matchingArtists = songsList.filter((songs) =>
      songs.artist.toLowerCase().includes(searchLower)
    );

    if (matchingArtists.length > 0) {
      // Si on trouve des artistes, on affiche tous leurs sons
      setSongsListFiltered(
        matchingArtists.sort((a, b) => {
          const artistCompare = a.artist.localeCompare(b.artist);
          if (artistCompare !== 0) return artistCompare;

          a.songs.sort((songA, songB) =>
            songA.song_name.localeCompare(songB.song_name)
          );
          b.songs.sort((songA, songB) =>
            songA.song_name.localeCompare(songB.song_name)
          );

          return 0;
        })
      );
    } else {
      // Si aucun artiste ne correspond, on cherche dans les noms de chansons
      const filteredList = songsList
        .map((artistSongs) => ({
          artist: artistSongs.artist,
          songs: artistSongs.songs.filter((song) =>
            song.song_name.toLowerCase().includes(searchLower)
          ),
        }))
        .filter((artistSongs) => artistSongs.songs.length > 0)
        .sort((a, b) => {
          const artistCompare = a.artist.localeCompare(b.artist);
          if (artistCompare !== 0) return artistCompare;

          a.songs.sort((songA, songB) =>
            songA.song_name.localeCompare(songB.song_name)
          );
          b.songs.sort((songA, songB) =>
            songA.song_name.localeCompare(songB.song_name)
          );

          return 0;
        });

      setSongsListFiltered(filteredList.length > 0 ? filteredList : null);
    }
  }, [search, songsList]);

  const changetextDifficulty = (difficulty: string) => {
    localStorage.setItem("textDifficulty", difficulty);
    setTextDificulty(difficulty);
  };

  return (
    <>
      <Header displaySearchBar={!!songsList} />
      <div className="m-5">
        <div className="mb-5">
          <div className="mb-2 text-2xl">Niveaux de difficultés :</div>
          <div className="grid grid-cols-3 gap-5">
            <Button variant={textDificulty === "trou_facile" ? "trou_facile_selected" : "trou_facile"} onClick={() => changetextDifficulty("trou_facile")} disabled>Texte à trous niveau facile</Button>
            <Button variant={textDificulty === "trou_moyen" ? "trou_moyen_selected" : "trou_moyen"} onClick={() => changetextDifficulty("trou_moyen")} disabled>Texte à trous niveau moyen</Button>
            <Button variant={textDificulty === "trou_difficile" ? "trou_difficile_selected" : "trou_difficile"} onClick={() => changetextDifficulty("trou_difficile")} disabled>Texte à trous niveau difficile</Button>
            <Button variant={textDificulty === "phrase_facile" ? "phrase_facile_selected" : "phrase_facile"} onClick={() => changetextDifficulty("phrase_facile")}>Phrase niveau facile</Button>
            <Button variant={textDificulty === "phrase_moyen" ? "phrase_moyen_selected" : "phrase_moyen"} onClick={() => changetextDifficulty("phrase_moyen")}>Phrase niveau moyen</Button>
            <Button variant={textDificulty === "phrase_difficile" ? "phrase_difficile_selected" : "phrase_difficile"} onClick={() => changetextDifficulty("phrase_difficile")}>Phrase niveau difficile</Button>
          </div>
          {selectDifficulty && <div className="text-red-500">Il faut séléctionner un niveau de difficulté</div>}
        </div>
        <div className="flex justify-between">
          <div className="text-2xl">Liste de musiques :</div>
          <Button disabled={isLoadingAddSong}>
            <Link
              href={isLoadingAddSong ? "" : `/addSong`}
              onClick={() => setIsLoadingAddSong(true)}
            >
              {isLoadingAddSong ? (
                <div className="flex gap-5">
                  <Loader2 className="animate-spin" />
                  Chargement...
                </div>
              ) : (
                <div>Ajouter une musique</div>
              )}
            </Link>
          </Button>
        </div>
        {songsListFiltered ? (
          songsListFiltered.map((songs, index) => (
            <div key={`${index}-${songs.artist}`} className="mt-5">
              <div className="mb-2">{songs.artist}</div>
              <div className="flex gap-4 flex-wrap">
                {songs.songs.map((song, index) => (
                  <Link
                    key={`${index}-${song.id}`}
                    href={!!isLoading ? "" : textDificulty ? `/rapGame/${song.id}` : ""}
                    className={`${!!isLoading && "cursor-progress"}`}
                  >
                    <Button
                      disabled={!!isLoading}
                      onClick={() => {
                      if (!textDificulty) setSelectDifficulty(true)
                      else setIsLoading(song.id)
                      }}
                    >
                      {isLoading === song.id ? (
                        <div className="flex gap-5">
                          <Loader2 className="animate-spin" />
                          Chargement...
                        </div>
                      ) : (
                        <div>{song.song_name}</div>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex gap-5">
            {isFetching ? (
              <>
                <Loader2 className="animate-spin" />
                Chargement...
              </>
            ) : (
              <div>Aucune musique</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Page;
