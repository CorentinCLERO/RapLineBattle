"use client";

import React, { ReactNode, useState } from "react";
import { GameContext, SongType } from "./GAmeContext";

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, setGameState] = useState<SongType | null>(null);

  const value = {
    gameState,
    setGameState,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}