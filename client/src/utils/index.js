
export function isValidClient({name, email}) {
  const errs = {}
  if(!name) {
    errs.name = "ingrese un nombre"
  }
  if(!email) {
    errs.email = "ingrese un email"
  }
  return errs
}