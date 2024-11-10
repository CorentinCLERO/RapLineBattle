import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import getTextScore from "@/app/utils/getTextScore";
import { SongType } from "@/app/rapGame/[id]/page";
import { Badge } from "./ui/badge";

type followScoreType = {
  score: number;
  step: number;
  goodAnswers: number;
};

function Game(getSong: SongType) {
  const [rapText, setRapText] = useState<string>("");
  const [nextbuttonVisible, setNextbuttonVisible] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [scores, setScores] = useState<followScoreType>({
    score: 0,
    step: 0,
    goodAnswers: 0,
  });
  const [RandomNumber, setRandomNumber] = useState<number | null>(null);
  const song = React.useMemo(
    () => (RandomNumber ? getSong.lyrics[RandomNumber] : "Loading..."),
    [getSong.lyrics, RandomNumber]
  );

  const getRandomNumber = useCallback(() => {
    setRandomNumber(Math.floor(Math.random() * getSong.lyrics.length));
  }, [getSong.lyrics.length]);

  useEffect(() => {
    if (getSong.lyrics) getRandomNumber()
  }, [getSong.lyrics, getRandomNumber]);

  const validateScore = () => {
    if (RandomNumber === null) return;

    const result = getTextScore(rapText, getSong.lyrics[RandomNumber + 1]);
    setIsValid(result.isValid);
    const scoresActual = {
      score: scores.score + result.value,
      step: scores.step + 1,
      goodAnswers: result.isValid ? scores.goodAnswers + 1 : scores.goodAnswers,
    }
    setScores(scoresActual)
    localStorage.setItem(`${getSong.id}`, JSON.stringify(scoresActual))
    setNextbuttonVisible(true)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !nextbuttonVisible) {
      validateScore();
    }
  };

  const nextQuestion = () => {
    setRapText("");
    setIsValid(null);
    setNextbuttonVisible(false);
    getRandomNumber();
  };

  if (getSong.lyrics && RandomNumber && localStorage.getItem("triche") === "admin") console.log(getSong.lyrics[RandomNumber + 1]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-5 w-4/5 mt-10">
        <div className="text-center text-xl">{song}</div>
        <Input
          type="text"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRapText(e.target.value);
            setIsValid(null);
          }}
          value={rapText}
          className={`border-2 mr-5 rounded ${
            isValid === null ? "" : isValid ? "text-green-500" : "text-red-500"
          }`}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between">
          <button
            className="border-none border-2 rounded-full px-5 py-2 text-xl bg-stone-500 hover:bg-stone-700 text-white disabled:bg-slate-300"
            onClick={() => validateScore()}
            disabled={nextbuttonVisible}
            >
            Valider
          </button>
          <button
            className="border-none border-2 rounded-full px-5 py-2 text-xl bg-stone-500 hover:bg-stone-700 text-white disabled:bg-slate-300"
            onClick={() => nextQuestion()}
            disabled={!nextbuttonVisible}
          >
            Suivant
          </button>
        </div>
        <div className="flex justify-end mt-20">
          <div className="border-none border-2 rounded-full px-5 py-2 text-base bg-stone-500 text-white font-bold">{scores.step}/10</div>
        </div>
      </div>
    </div>
  );
}

export default Game;
