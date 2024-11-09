import { distance } from 'fastest-levenshtein';

function checkPhrase(guess: string, target: string, threshold = 0.8): boolean {
  // Normalisation pour enlever les accents, majuscules, ponctuations
  const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, "");

  const normalizedGuess = normalize(guess);
  const normalizedTarget = normalize(target);

  const dist = distance(normalizedGuess, normalizedTarget);
  const similarity = 1 - (dist / Math.max(normalizedGuess.length, normalizedTarget.length));
  
  return similarity >= threshold;
}

export default checkPhrase;