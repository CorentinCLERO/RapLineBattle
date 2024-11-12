"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Game from "@/components/Game";
import { Loader2 } from "lucide-react";
import { SongType } from "@/context/GameContext";

function Page() {
  const searchParams = useParams();
  const [getSong, setGetSong] = useState<SongType | null>(null);

  useEffect(() => {
    fetch(`/api/song/${searchParams?.id}`)
      .then((res) => res.json())
      .then((res) => setGetSong(res))
      .catch(() => console.error("Echec de la requête"));
  }, [searchParams?.id]);

  return (
    <>
      <Header
        song={getSong ? `${getSong.artist} - ${getSong.song_name}` : ""}
      />
      {getSong ?
        <Game {...getSong} /> :
        <div className="flex gap-5">
          <>
            <Loader2 className="animate-spin" />
            Chargement...
          </>
      </div>
      }
    </>
  );
}

export default Page;
