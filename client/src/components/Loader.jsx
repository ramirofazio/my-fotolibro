import {ArrowPathIcon} from "@heroicons/react/24/outline"

export function Loader() {
  return (
    <main className="flex h-screen w-screen items-center justify-center border-2 absolute bg-black/50">
      <main
        className={`absolute z-50 grid aspect-square  h-20 place-content-center place-items-center rounded-md bg-white/70 lg:h-40 `}
      >
        <ArrowPathIcon className="h-10 text-red-500  animate-spin text-6xl text-gold" />
        <p>cargando</p>
      </main>
    </main>
  );
}