import { API } from "../api_instance";

export function isValidClient({ name, email, dni, phone }) {
  const errs = {};
  if (!name) errs.name = "ingrese un nombre";
  if (name.length < 4) errs.name;

  if (!email) errs.email = "ingrese un email";
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|gob|com\.ar|gob\.ar)$/.test(email)
  )
    errs.email = "ingrese un email valido";

  if (!dni) errs.dni = "ingrese DNI";
  if (dni?.length < 7) errs.dni = "ingrese un DNI valido";
  if (dni?.length > 15) errs.dni = "DNI muy largo";

  if (!phone) errs.phone = "ingrese un numero";
  if (phone?.length < 7) errs.phone = "ingrese un numero valido";
  if (phone?.length > 18) errs.phone = "ingrese un numero valido";

  return errs;
}

export function isValidClientForAdmin({ name }) {
  const errs = {};
  if (!name) errs.name = "ingrese un nombre";
  if (name.length < 4) errs.name = "minimo 4 caracteres";

  return errs;
}

export function parseDate(_date) {
  let [date, time] = _date.split("T");
  let [year, month, day] = date.split("-");
  let hour = time.slice(0, 5);
  return `${day}/${month}/${year.slice(-2)} - ${hour}`;
}

export function handleClosing(clientId) {
  API.session.disconnect({ clientId });
}
