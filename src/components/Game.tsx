import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import getTextScore from "@/app/utils/getTextScore";
import { SongType } from "@/app/rapGame/[id]/page";

type followScoreType = {
  score: number;
  step: number;
  goodAnswers: number;
  askedRhymes: string;
};

function Game(getSong: SongType) {
  const [rapText, setRapText] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const localScoreString = localStorage.getItem(`${getSong.id}`);
  const localScore = localScoreString ? JSON.parse(localScoreString) : null;
  const [scores, setScores] = useState<followScoreType>({
    score: localScore ? localScore.score : 0,
    step: localScore ? localScore.step : 0,
    goodAnswers: localScore ? localScore.goodAnswers : 0,
    askedRhymes: localScore ? localScore.askedRhymes : "",
  });
  const [nextbuttonVisible, setNextbuttonVisible] = useState<boolean>(localScore ? localScore.step === 10 : false);
  const [RandomNumber, setRandomNumber] = useState<number | null>(null);
  const song = React.useMemo(
    () => (RandomNumber ? getSong.lyrics[RandomNumber] : "Loading..."),
    [getSong.lyrics, RandomNumber]
  );
  const validatedScore = localStorage.getItem(`score-${getSong.id}`);
  const validatedScoresArray = validatedScore ? validatedScore.split(',') : []

  const getRandomNumber = useCallback(() => {
    const randomNumberGenerate = Math.floor(Math.random() * getSong.lyrics.length)
    if (scores.askedRhymes.includes(randomNumberGenerate.toString())) getRandomNumber()
    setRandomNumber(randomNumberGenerate);
  }, [getSong.lyrics.length, scores.askedRhymes]);

  useEffect(() => {
    if (getSong.lyrics) getRandomNumber()
  }, [getSong.lyrics, getRandomNumber]);

  const validateScore = () => {
    if (RandomNumber === null || rapText.length <=5) return;

    const result = getTextScore(rapText, getSong.lyrics[RandomNumber + 1]);
    setIsValid(result.isValid);
    const scoresActual = {
      score: scores.score + result.value,
      step: scores.step + 1,
      goodAnswers: result.isValid ? scores.goodAnswers + 1 : scores.goodAnswers,
      askedRhymes: scores.askedRhymes ? `${scores.askedRhymes},${RandomNumber}` : `${RandomNumber}`
    }
    setScores(scoresActual)
    localStorage.setItem(`${getSong.id}`, JSON.stringify(scoresActual))
    setNextbuttonVisible(true)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !nextbuttonVisible) {
      validateScore();
    } else if (e.key === "Enter" && nextbuttonVisible) {
      nextQuestion();
    }
  };

  const nextQuestion = () => {
    setRapText("");
    setIsValid(null);
    setNextbuttonVisible(false);
    getRandomNumber();
  };

  const resetData = () => {
    const pourcentageGoodAnswers = Math.round(scores.score * 1000) / 100
    localStorage.setItem(`score-${getSong.id}`, validatedScore ? `${validatedScore},${scores.goodAnswers}/${pourcentageGoodAnswers}/${Date.now()}` : `${scores.goodAnswers}/${pourcentageGoodAnswers}/${Date.now()}` );
    localStorage.removeItem(`${getSong.id}`);
    setScores({
      score: 0,
      step: 0,
      goodAnswers: 0,
      askedRhymes: "",
    });
    setRapText("");
    setIsValid(null);
    setNextbuttonVisible(false);
    getRandomNumber();
  };

  if (getSong.lyrics && RandomNumber && localStorage.getItem("triche") === "admin") console.log(getSong.lyrics[RandomNumber + 1]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-5 w-4/5 mt-10">
        <div className="text-center text-xl">{scores.step === 10 ? "Tu as finis !" : song}</div>
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
          disabled={scores.step === 10}
        />
        <div className="flex justify-between">
          <button
            className="border-none border-2 rounded-full px-5 py-2 text-xl bg-stone-500 hover:bg-stone-700 text-white disabled:bg-slate-300"
            onClick={() => validateScore()}
            disabled={nextbuttonVisible}
            >
            Valider
          </button>
          {scores.step !== 10 && <button
            className="border-none border-2 rounded-full px-5 py-2 text-xl bg-stone-500 hover:bg-stone-700 text-white disabled:bg-slate-300"
            onClick={() => nextQuestion()}
            disabled={!nextbuttonVisible}
          >
            Suivant
          </button>}
        </div>
        <div className="flex justify-end mt-20">
          <div className="border-none border-2 rounded-full px-5 py-2 text-base bg-stone-700 text-white font-bold hover:cursor-default">{scores.step}/10</div>
        </div>
        {scores.step === 10 && 
          <div>
            <button
              className="border-none border-2 rounded-full px-5 py-2 text-xl bg-stone-500 hover:bg-stone-700 text-white"
              onClick={resetData}
            >
              Recommencer
            </button>
          </div>
        }
        <div>
          <div className="mb-5">Tableau des scores :</div>
          <div className="grid grid-cols-3 border">
            <div className="border p-2">Date</div>
            <div className="border p-2">Scores /10</div>
            <div className="border p-2">% d&apos;éxactitude</div>
            <div className="border p-2">En cours</div>
            <div className="border p-2">{scores.goodAnswers}</div>
            <div className="border p-2">{Math.round(scores.score * 1000) / 100}</div>
            {
              validatedScoresArray.map((score, index) => {
                const scoreDetails = score.split('/')
                return (
                  <React.Fragment key={index}>
                    <div className="border p-2">{new Date(Number(scoreDetails[2])).toLocaleString()}</div>
                    <div className="border p-2">{scoreDetails[0]}</div>
                    <div className="border p-2">{scoreDetails[1]}</div>
                  </React.Fragment>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
