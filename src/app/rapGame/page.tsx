"use client";
import React, { useEffect, useState } from "react";
import getScore from "../utils/getTextScore";
import songplk from "../songArray/PlkEmotif.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Page() {
  const [rapText, setRapText] = useState<string>("");
  const [score, setScore] = useState<boolean | null>(null);
  const [RandomNumber, setRandomNumber] = useState<number | null>(null);
  const song = RandomNumber ? songplk[RandomNumber] : "Loading...";

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * songplk.length));
  }, []);

  const validateScore = () => {
    if (RandomNumber === null) return;
    setScore(getScore(rapText, songplk[RandomNumber + 1]));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      validateScore();
    }
  };

  return (
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
        {/* <div>{songplk[(RandomNumber || 0) + 1]}</div> */}
        <div>
          <Button onClick={() => validateScore()}>Valider</Button>
        </div>
      </div>
    </div>
  );
}

export default Page;
