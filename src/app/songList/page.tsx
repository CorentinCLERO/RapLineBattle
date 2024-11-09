"use client";

import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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
  const [songsListFiltered, setSongsListFiltered] = useState<songList | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isLoadingAddSong, setIsLoadingAddSong] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const search = searchParams?.get("search") || "";

  useEffect(() => {
    fetch("/api/songsList")
      .then((res) => res.json())
      .then((res) => setSongsList(res))
      .catch(() => console.error("Echec de la requête"))
      .finally(() => setIsFetching(false))
  }, []);

  useEffect(() => {
    if (!songsList) {
      setSongsListFiltered(null);
      return;
    }
  
    const searchLower = search.toLowerCase();
    
    // Vérifie si la recherche correspond à un artiste
    const matchingArtists = songsList.filter(songs => 
      songs.artist.toLowerCase().includes(searchLower)
    );
  
    if (matchingArtists.length > 0) {
      // Si on trouve des artistes, on affiche tous leurs sons
      setSongsListFiltered(
        matchingArtists.sort((a, b) => {
          const artistCompare = a.artist.localeCompare(b.artist);
          if (artistCompare !== 0) return artistCompare;
          
          a.songs.sort((songA, songB) => songA.song_name.localeCompare(songB.song_name));
          b.songs.sort((songA, songB) => songA.song_name.localeCompare(songB.song_name));
          
          return 0;
        })
      );
    } else {
      // Si aucun artiste ne correspond, on cherche dans les noms de chansons
      const filteredList = songsList
        .map(artistSongs => ({
          artist: artistSongs.artist,
          songs: artistSongs.songs.filter(song => 
            song.song_name.toLowerCase().includes(searchLower)
          )
        }))
        .filter(artistSongs => artistSongs.songs.length > 0)
        .sort((a, b) => {
          const artistCompare = a.artist.localeCompare(b.artist);
          if (artistCompare !== 0) return artistCompare;
          
          a.songs.sort((songA, songB) => songA.song_name.localeCompare(songB.song_name));
          b.songs.sort((songA, songB) => songA.song_name.localeCompare(songB.song_name));
          
          return 0;
        });
  
      setSongsListFiltered(filteredList.length > 0 ? filteredList : null);
    }
  }, [search, songsList]);

  return (
    <>
      <Header displaySearchBar={!!songsList} />
      <div className="m-5">
        <div className="flex justify-between">
          <div className="text-2xl">Liste de musiques :</div>
          <Link href={isLoadingAddSong ? "" : `/addSong`} className="border-none border-2 rounded-full px-5 py-2 text-xl bg-stone-500 hover:bg-stone-700 text-white disabled:bg-slate-300" onClick={() => setIsLoadingAddSong(true)}>
            {isLoadingAddSong ?
              <div className="flex gap-5">
                <Loader2 className="animate-spin" />
                Chargement...
              </div> :
              <div>Ajouter une musique</div>
            }
          </Link>
        </div>
        {songsListFiltered ?
          songsListFiltered.map((songs, index) => (
            <div key={`${index}-${songs.artist}`} className="mt-5">
              <div className="mb-2">{songs.artist}</div>
              <div className="flex gap-4 flex-wrap">
                {songs.songs.map((song, index) => (
                  <Link
                    key={`${index}-${song.id}`}
                    href={!!isLoading ? "" : `/rapGame/${song.id}`}
                    className={`${!!isLoading && "cursor-progress"}`}
                  >
                    <button
                      className="border-none border-2 rounded-full px-5 py-2 text-xl bg-stone-500 hover:bg-stone-700 text-white disabled:bg-slate-300"
                      disabled={!!isLoading}
                      onClick={() => setIsLoading(song.id)}
                    >
                      {isLoading === song.id ? (
                        <div className="flex gap-5">
                          <Loader2 className="animate-spin" />
                          Chargement...
                        </div>
                      ) : (
                        <div>{song.song_name}</div>
                      )}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          )) :
          <div className="flex gap-5">
            {isFetching ? 
              <>
                <Loader2 className="animate-spin" />
                Chargement...
              </> :
              <div>Aucune musique</div>
            }
          </div>}
      </div>
    </>
  );
}

export default Page;
