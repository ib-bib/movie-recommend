import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import Image from 'next/image';

export default async function Home() {

  return (
    <main className="flex items-center justify-center flex-col gap-2 grow">
      <Image src='/logo-full.png' alt="Fusion" width={300} height={300} />
      <div className='bg-transparent backdrop-blur-md w-1/3 rounded-full h-14 px-2 flex items-center border-white border gap-2'>
        <MagnifyingGlassIcon className="size-6 text-white-500" />
        <input type='text' placeholder='Search...' className='outline-none grow flex' />
      </div>
    </main>
  );
}
