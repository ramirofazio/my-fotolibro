import { NavLink } from "react-router-dom";

const links = [
  { link: "client_data", text: "Completar sus datos" },
  { link: "upload_images", text: "Subir sus fotos" },
  { link: "sort_images", text: "Ordenar las fotos" },
];

export function Nav() {
  return (
    <nav className="border-2 border-black">
      {links.map((l, i) => (
        <NavLink key={i} to={l.link}>
          <p>{l.text}</p>
        </NavLink>
      ))}
    </nav>
  );
}
