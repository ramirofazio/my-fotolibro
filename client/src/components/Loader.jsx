import { ArrowPathIcon } from '@heroicons/react/24/outline'

export function Loader({ text = 'cargando' }) {
  return (
    <main className="flex inset-0 h-screen w-screen items-center justify-center fixed z-50 bg-black/50">
      <main
        className={`absolute z-50 grid aspect-square  h-20 place-content-center place-items-center rounded-md bg-white/70 lg:h-40 `}
      >
        <ArrowPathIcon className="h-10 text-red-500  animate-spin text-6xl text-gold" />
        <p className="text-red-500">{text}</p>
      </main>
    </main>
  )
}
