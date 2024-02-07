import { useNavigation } from '../contexts/NavigationContext'

export function Nav() {
  const routes = useNavigation().getSteps()
  const { current } = useNavigation()

  return (
    <nav className="grid grid-cols-3 px-1">
      {routes.map(({ text, index }, i) => (
        <div
          key={i}
          className={`flex flex-col items-center  justify-center py-2 ${
            current === index
              ? ' border-b-2 border-blue-700 text-xl font-medium'
              : 'bg-base border-b'
          }`}
        >
          <p
            className={`aspect-square !justify-self-start text-center text-4xl rounded-full w-fit py-2 px-4  ${
              current === index ? 'bg-blue-700' : 'bg-slate-400 '
            }`}
          >
            {index + 1}
          </p>
          <p className="text-center text-xl md:text-3xl">{text}</p>
        </div>
      ))}
    </nav>
  )
}
