"use client";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as yup from "yup";

function Page() {
  const router = useRouter();
  const [errors, setErrors] = useState<{
    artist?: string;
    songName?: string;
    lyrics?: string;
  }>({});

  const schema = yup.object().shape({
    artist: yup.string().required("Le nom de l'artiste est requis"),
    songName: yup.string().required("Le nom de la musique est requis"),
    lyrics: yup
      .string()
      .test(
        "min-phrases",
        "Les paroles doivent contenir au moins 10 phrases",
        (value) => (value ? value.split("\n").length >= 10 : false)
      )
      .required("Les paroles sont requises"),
  });

  const handleSubmit = async () => {
    setErrors({});

    const artist = (
      document.querySelector(
        'input[placeholder="Nom de l\'artiste"]'
      ) as HTMLInputElement
    ).value;
    const songName = (
      document.querySelector(
        'input[placeholder="Nom de la musique"]'
      ) as HTMLInputElement
    ).value;
    const lyrics = (
      document.querySelector(
        'textarea[placeholder="Paroles de la musique (Les retours à la ligne marqueront la différence entre chaque phrase)"]'
      ) as HTMLTextAreaElement
    ).value;

    try {
      await schema.validate(
        { artist, songName, lyrics },
        { abortEarly: false }
      );

      const response = await fetch("/api/song", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artist,
          song_name: songName,
          lyrics: lyrics.split("\n"),
        }),
      });

      if (response.ok) {
        console.log("Song added successfully");
        router.push("/songList");
      } else {
        console.error("Failed to add song");
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    handleSubmit();
  };

  return (
    <>
      <Header />
      <div className="m-10 flex gap-5 flex-col">
        <div>
          <Input type="text" placeholder="Nom de l'artiste" />
          {errors.artist && (
            <p className="text-red-500 text-sm mt-1">{errors.artist}</p>
          )}
        </div>

        <div>
          <Input type="text" placeholder="Nom de la musique" />
          {errors.songName && (
            <p className="text-red-500 text-sm mt-1">{errors.songName}</p>
          )}
        </div>

        <div>
          <Textarea
            placeholder="Paroles de la musique (Les retours à la ligne marqueront la différence entre chaque phrase)"
            className="h-96"
          />
          {errors.lyrics && (
            <p className="text-red-500 text-sm mt-1">{errors.lyrics}</p>
          )}
        </div>

        <Button onClick={handleClick}>Valider</Button>
      </div>
    </>
  );
}

export default Page;
