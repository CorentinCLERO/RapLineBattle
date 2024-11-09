"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import getTextScore from "@/app/utils/getTextScore";
import { useParams } from "next/navigation";
import Header from "@/components/Header";

type song = {
  id: string,
  artist: string,
  song_name: string,
  lyrics: string[],
}

function Page() {
  const params = useParams()
  const [rapText, setRapText] = useState<string>("");
  const [score, setScore] = useState<boolean | null>(null);
  const [RandomNumber, setRandomNumber] = useState<number | null>(null);
  const [getSong, setGetSong] = useState<song |null>(null)
  const lyrics = React.useMemo(() => (getSong ? getSong.lyrics : []), [getSong]);
  const song = React.useMemo(() => (RandomNumber ? lyrics[RandomNumber] : "Loading..."), [lyrics, RandomNumber]);

  useEffect(() => {
    fetch(`/api/song/${params?.id}`)
    .then(res => res.json())
    .then(res => setGetSong(res))
    .catch(() => console.error("Echec de la requête"))
  }, [params?.id]);

  useEffect(() => {
     if (lyrics) setRandomNumber(Math.floor(Math.random() * lyrics.length));
  }, [lyrics]);

  const validateScore = () => {
    if (RandomNumber === null) return;
    
    const result = getTextScore(rapText, lyrics[RandomNumber + 1])
    setScore(result.isValid);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateScore();
    }
  };

  return (
    <>
      <Header displaySearchBar={false} />
      <div className="flex justify-center">
        <div className="flex flex-col gap-5 w-4/5 mt-10">
          <div className="text-center text-5xl">Rap game</div>
          <div className="text-center text-xl">{song}</div>
          <Input
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setRapText(e.target.value);
              setScore(null);
            }}
            className={`border-2 mr-5 rounded ${
              score === null ? "" : score ? "text-teal-500" : "text-amber-700"
            }`}
            onKeyDown={handleKeyDown}
          />
          <div>{lyrics && lyrics[(RandomNumber || 0) + 1]}</div>
          <div>
            <Button onClick={() => validateScore()}>Valider</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
