import { FolderIcon, ArrowDownTrayIcon, XCircleIcon } from "@heroicons/react/24/outline"


export function FolderCard({name, id}) {
  return ( 
    <div className="border-2  w-fit rounded-md px-1">
      <div className="w-fit ml-auto">
        <ArrowDownTrayIcon className="w-8 inline"/>
        <XCircleIcon className="w-8 inline"/>
      </div>
      <div className="flex items-center border-t-2">
        <FolderIcon className="h-20 w-20 text-blue-700"/>
        <div>
          <h1 className="text-white">{name}</h1>
          <h2 className="text-white">{id}</h2>
        </div>
        </div>
    </div>
  )
}