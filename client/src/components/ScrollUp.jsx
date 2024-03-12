import { ArrowUpIcon } from "@heroicons/react/24/outline";

export function ScrollUp() {
  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className="absolute p-1 rounded-full border-2 border-violet-600 bg-violet-400"
      onClick={scrollUp}
    >
      <ArrowUpIcon className="w-6" />
    </button>
  );
}
