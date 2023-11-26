import {ClockIcon} from "@heroicons/react/24/outline"


export function UrlInUse() {
  return (
    <main className="border-2 flex items-center justify-center h-screen ">
      <div className="flex  items-center w-fit border-slate-800 border-4 bg-slate-700 p-4 gap-2">
        <ClockIcon className="h-12 text-red-600" />
        <h1 className="text-2xl">El link actual se esta usando en este momento</h1>
      </div>
    </main>
  )
}