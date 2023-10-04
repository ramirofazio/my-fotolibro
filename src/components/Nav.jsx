import { NavLink } from "react-router-dom";

const links = [
  { link: "client_data", text: "Completa tus datos" },
  { link: "upload_images", text: "Subi tus fotos" },
  { link: "sort_images", text: "Ordena las fotos" },
];

export function Nav() {
  return (
    <nav className="border-2  border-black grid grid-cols-3 gap-2 px-1">
      {links.map((l, i) => (
        <NavLink
          key={i}
          to={l.link}
          className={({ isActive }) =>
            `flex flex-col rounded-md bg-base items-center py-2 border-2 ${isActive ? "border-white" : " border-black opacity-30"}`
          }
        >
          <div className={`justify-self-center rounded-full w-fit px-2 bg-blue-700`}><p>{i + 1}</p></div>
          <p className="text-center">{l.text}</p>
        </NavLink>
      ))}
    </nav>
  );
}
