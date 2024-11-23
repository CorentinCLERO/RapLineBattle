import { distance } from 'fastest-levenshtein';

type output = {
  isValid: boolean,
  value: number
}

function getTextScore(guess: string, target: string, threshold = 0.5): output {
  // Normalisation pour enlever les accents, majuscules, ponctuations
  const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, "");

  const normalizedGuess = normalize(guess);
  const normalizedTarget = normalize(target);

  const dist = distance(normalizedGuess, normalizedTarget);
  const similarity = 1 - (dist / Math.max(normalizedGuess.length, normalizedTarget.length));
  
  return {
    isValid: similarity >= threshold,
    value: similarity
  };
}

export default getTextScore;