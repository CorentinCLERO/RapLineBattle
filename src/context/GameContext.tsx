"use client";

import { createContext } from "react";

export type SongType = {
  id: string;
  artist: string;
  song_name: string;
  lyrics: string[];
};

export const GameContext = createContext({});