import { NavLink } from "react-router-dom";

const links = [
  { link: "folders", text: "Carpetas" },
  { link: "clients/create", text: "Clientes" },
];

export function AdminNav() {
  return (
    <nav className="border-2  border-black grid grid-cols-2 gap-2 px-1">
      {links.map((l, i) => (
        <NavLink
          key={i}
          to={l.link}
          className={({ isActive }) =>
            `flex flex-col rounded-md bg-base items-center py-2 border-2 ${
              isActive ? "border-white" : " border-black opacity-30"
            }`
          }
        >
          <p className="text-center">{l.text}</p>
        </NavLink>
      ))}
    </nav>
  );
}
