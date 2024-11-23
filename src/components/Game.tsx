import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import getTextScore from "@/app/utils/getTextScore";
import { SongType } from "@/context/GameContext";
import { Button } from "./ui/button";

type followScoreType = {
  score: number;
  step: number;
  goodAnswers: number;
  askedRhymes: string;
  askedClues: number;
};

function Game(getSong: SongType) {
  const [rapText, setRapText] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [askedClues, setAskedClues] = useState<number>(0);
  const [secondRhyme, setSecondRhyme] = useState<boolean>(false);
  const localScoreString = localStorage.getItem(`${getSong.id}`);
  const localScore = localScoreString ? JSON.parse(localScoreString) : null;
  const text_difficulty = localStorage.getItem('textDifficulty');
  const getThreshold = useCallback(() => {
    if (!text_difficulty) return 0.8;
  
    if (text_difficulty.includes('facile')) {
      return 0.5;
    } else if (text_difficulty.includes('moyen')) {
      return 0.65;
    } else if (text_difficulty.includes('difficile')) {
      return 0.8;
    }
  
    return 65;
  }, [text_difficulty]);
  const [scores, setScores] = useState<followScoreType>({
    score: localScore ? localScore.score : 0,
    step: localScore ? localScore.step : 0,
    goodAnswers: localScore ? localScore.goodAnswers : 0,
    askedRhymes: localScore ? localScore.askedRhymes : "",
    askedClues: localScore && localScore.askedClues ? localScore.askedClues : 0,
  });
  const [nextbuttonVisible, setNextbuttonVisible] = useState<boolean>(
    localScore ? localScore.step === 10 : false
  );
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const clueRhymes = React.useMemo(
    () => (randomNumber ? getSong.lyrics[randomNumber] : "Loading..."),
    [getSong.lyrics, randomNumber]
  );
  const SecondClueRhymes = React.useMemo(
    () => (randomNumber ? getSong.lyrics[randomNumber - 1] : null),
    [getSong.lyrics, randomNumber]
  );
  const askedRhymes = React.useMemo(
    () => (randomNumber ? getSong.lyrics[randomNumber + 1] : "Loading..."),
    [getSong.lyrics, randomNumber]
  );
  const validatedScore = localStorage.getItem(`score-${getSong.id}`);
  const validatedScoresArray = validatedScore ? validatedScore.split(",") : [];

  const getRandomNumber = useCallback(() => {
    const randomNumberGenerate = Math.floor(
      Math.random() * getSong.lyrics.length
    );
    const occurrences = getSong.lyrics.filter((line) => line === getSong.lyrics[randomNumberGenerate]).length;
    if (scores.askedRhymes.includes(randomNumberGenerate.toString()) || occurrences > 1) {
      return getRandomNumber();
    }
    setRandomNumber(randomNumberGenerate);
  }, [getSong.lyrics, scores.askedRhymes]);

  useEffect(() => {
    if (getSong.lyrics && !rapText) getRandomNumber();
  }, [getSong.lyrics, getRandomNumber, rapText]);

  const validateScore = () => {
    if (randomNumber === null || rapText.length <= 5) return;
    const result = getTextScore(rapText, askedRhymes, getThreshold());

    setIsValid(result.isValid);
    const scoresActual = {
      score: scores.score + result.value,
      step: scores.step + 1,
      goodAnswers: result.isValid ? scores.goodAnswers + 1 : scores.goodAnswers,
      askedRhymes: scores.askedRhymes
        ? `${scores.askedRhymes},${randomNumber}`
        : `${randomNumber}`,
      askedClues: scores.askedClues + askedClues + Number(secondRhyme),
    };
    setScores(scoresActual);
    localStorage.setItem(`${getSong.id}`, JSON.stringify(scoresActual));
    setNextbuttonVisible(true);
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
    setSecondRhyme(false);
    setAskedClues(0);
  };

  const resetData = () => {
    const pourcentageGoodAnswers = Math.round(scores.score * 1000) / 100;
    localStorage.setItem(
      `score-${getSong.id}`,
      validatedScore
        ? `${validatedScore},${
            scores.goodAnswers
          }/${pourcentageGoodAnswers}/${Date.now()}/${text_difficulty}/${scores.askedClues}`
        : `${scores.goodAnswers}/${pourcentageGoodAnswers}/${Date.now()}/${text_difficulty}/${scores.askedClues}`
    );
    localStorage.removeItem(`${getSong.id}`);
    setScores({
      score: 0,
      step: 0,
      goodAnswers: 0,
      askedRhymes: "",
      askedClues: 0,
    });
    setRapText("");
    setIsValid(null);
    setNextbuttonVisible(false);
    getRandomNumber();
    setSecondRhyme(false);
    setAskedClues(0);
  };

  const clueFunction = () => {
    if (rapText && rapText !== askedRhymes?.split(" ").slice(0, askedClues).join(" ")) return setRapText(askedRhymes?.split(" ").slice(0, askedClues).join(" "));
    const newAskedValue = askedClues + 1;
    setAskedClues(newAskedValue);
    setRapText(askedRhymes?.split(" ").slice(0, newAskedValue).join(" "));
  }

  if (
    getSong.lyrics &&
    randomNumber &&
    localStorage.getItem("triche") === "admin"
  )
    console.log(askedRhymes);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-5 w-4/5 mt-10">
        <div>
        {scores.step >= 10 ? 
        <div className="text-center text-xl">
          Tu as finis !
        </div> : 
        <>
          {secondRhyme ?
            <div className="text-center text-xl">{randomNumber && SecondClueRhymes ? SecondClueRhymes : "La phrase ci dessous est la première phrase"}</div> :
            <Button onClick={() => setSecondRhyme(true)}>Ajouter une deuxième phrase</Button>
          }
          <div className="text-center text-xl">
            {clueRhymes}
          </div>
        </>
        }
        </div>
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
          <Button onClick={() => validateScore()} disabled={nextbuttonVisible}>
            Valider
          </Button>
          {scores.step !== 10 && (
            <Button
              onClick={() => nextQuestion()}
              disabled={!nextbuttonVisible}
            >
              Suivant
            </Button>
          )}
        </div>
        {askedClues <= 1 && <div className="flex justify-center">
          <Button onClick={() => clueFunction()}>Me donner un indice</Button>
        </div>}
        <div className="flex justify-end mt-10">
          <div className="border-none border-2 rounded-md px-5 py-2 text-base bg-stone-700 text-white font-bold hover:cursor-default">
            {scores.step}/10
          </div>
        </div>
        {scores.step === 10 && (
          <div>
            <Button onClick={resetData}>Recommencer</Button>
          </div>
        )}
        <div>
          <div className="mb-5">Tableau des scores :</div>
          <div className="grid grid-cols-5 border mb-10">
            <div className="border p-2">Date</div>
            <div className="border p-2">Scores /10</div>
            <div className="border p-2">% d&apos;éxactitude</div>
            <div className="border p-2">Niveau de difficulté</div>
            <div className="border p-2">Indices demandés</div>
            <div className="border p-2">En cours</div>
            <div className="border p-2">{scores.goodAnswers}</div>
            <div className="border p-2">
              {Math.round(scores.score * 1000) / 100}
            </div>
            <div className="border p-2">{text_difficulty?.replace("_", " ")}</div>
            <div className="border p-2">{(isValid === null || scores.step >= 10 ? (scores.askedClues + askedClues + Number(secondRhyme)) : (askedClues + Number(secondRhyme)))?.toString()}</div>
            {validatedScoresArray?.reverse().map((score, index) => {
              const scoreDetails = score.split("/");
              return (
                <React.Fragment key={index}>
                  <div className="border p-2">
                    {new Date(Number(scoreDetails[2])).toLocaleString()}
                  </div>
                  <div className="border p-2">{scoreDetails[0]}</div>
                  <div className="border p-2">{scoreDetails[1]}</div>
                  <div className="border p-2">{scoreDetails[3] ? scoreDetails[3].replace("_", " ") : "non défini" }</div>
                  <div className="border p-2">{scoreDetails[4] ? scoreDetails[4] : "non défini" }</div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
