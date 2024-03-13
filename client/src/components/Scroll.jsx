import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

export function Scroll() {
  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollDown = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className=" z-50 fixed right-0.5 bottom-28 md:bottom-36 justify-center gap-1.5 flex flex-col items-center">
      <button
        className=" p-1 rounded-full border-2 border-violet-600 bg-violet-400"
        onClick={scrollUp}
      >
        <ArrowUpIcon className="w-5 md:w-6 text-white " />
      </button>
      <hr className="border-[1px] w-full" />
      <button
        className="  p-1 rounded-full border-2 border-violet-600 bg-violet-400"
        onClick={scrollDown}
      >
        <ArrowDownIcon className="w-5 md:w-6 text-white " />
      </button>
    </div>
  );
}
