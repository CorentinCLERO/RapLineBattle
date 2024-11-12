"use client";

import { GameProvider } from "@/context/GameProvider";

export default function RapGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GameProvider>{children}</GameProvider>;
}