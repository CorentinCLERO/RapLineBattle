import Link from 'next/link';

export default function Home() {
  return (
    <div className="grid gap-40 justify-center content-center h-dvh">
      <h1 className="text-8xl">Rhymes</h1>
      <div className='grid justify-center'>
        <button className='border-none border-2 rounded-full px-5 py-2 text-xl bg-gray-500 hover:bg-gray-700 text-white'>
          <Link href="/songList">Choisir un song</Link>
        </button>
      </div>
    </div>
  );
}
