'use client';

export default function Home() {
  async function createSong() {
    const response = await fetch('/api/songs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        artist: 'Artiste Exemple',
        song_name: 'Nom de la Chanson',
        lyrics: ['Paroles de la chanson'],
      }),
    });
  
    if (response.ok) {
      const song = await response.json();
      console.log('Chanson créée:', song);
    } else {
      const errorInfo = await response.json();
      console.error('Erreur lors de la création de la chanson:', errorInfo);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button onClick={() => createSong()}>Add song</button>
    </div>
  );
}
