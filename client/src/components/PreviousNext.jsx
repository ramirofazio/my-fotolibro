import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { NavLink, useLocation } from "react-router-dom";
import { useNavigation } from "../contexts/NavigationContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function PreviousNext() {
  let pathname = useLocation().pathname.split("/");
  pathname = pathname[pathname.length - 1];
  const { current, getSteps, setCurrent, accessNext } = useNavigation();
  useEffect(() => {
    setCurrent(pathname);
  }, [pathname]);
  return (
    <>
      <div
        className={`flex mt-2 px-1 ${
          current === 0
            ? "justify-end"
            : current === 2
            ? "justify-start"
            : "justify-between"
        } text-white py-2 px-4`}
      >
        {current !== 0 && (
          <NavLink
            className=" md:text-2xl lg:text-3xl border-b-2 p-1 border-violet-500 flex gap-2 items-center group hover:font-medium"
            to={getSteps()[current - 1]?.to}
          >
            <ChevronLeftIcon className="md:w-10 animation aspect-square w-7 group-hover:bg-blue-700 rounded-full text-center p-1 group-hover:scale-125" />
            Atras
          </NavLink>
        )}
        {current !== 2 &&
          (accessNext.value ? (
            <NavLink
              className="animate-pulse md:text-2xl lg:text-3xl border-b-2 border-violet-500 flex gap-2 items-center group hover:font-medium"
              to={getSteps()[current + 1]?.to}
            >
              {getSteps()[current + 1]?.nextText}
              <ChevronRightIcon className="md:w-10 aspect-square w-7 group-hover:bg-blue-700 rounded-full text-center p-1 group-hover:scale-125" />
            </NavLink>
          ) : (
            <button
              className=" border-b-2 p-2 border-violet-500 md:text-2xl lg:text-3xl flex gap-2 items-center group hover:font-medium hover:text-gray-400"
              onClick={() => toast.error(accessNext.msg)}
            >
              {getSteps()[current + 1]?.nextText}
              <ChevronRightIcon className="aspect-square w-6" />
            </button>
          ))}
      </div>
    </>
  );
}
