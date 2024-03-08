import { isValidClient, isValidClientForAdmin } from "../../utils";
import { useEffect, useRef } from "react";

export function PersonalData({
  client,
  _client,
  admin = false,
  setClient,
  errs,
  setErrs,
  resetInput,
  setResetInput,
}) {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const dniRef = useRef(null);
  const phoneRef = useRef(null);

  useEffect(() => {
    if (resetInput) {
      resetInputs();
      setResetInput(false);
    }
  }, [resetInput, client]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (admin) {
      setClient((prev) => {
        setErrs(
          isValidClientForAdmin({
            ...prev,
            [name]: value,
          })
        );
        if (type === "number") {
          return {
            ...prev,
            [name]: parseInt(value),
          };
        }
        return {
          ...prev,
          [name]: value,
        };
      });
    } else {
      setClient((prev) => {
        setErrs(
          isValidClient({
            ...prev,
            [name]: value,
          })
        );
        if (type === "number") {
          return {
            ...prev,
            [name]: parseInt(value),
          };
        }
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  function resetInputs() {
    nameRef.current.value = "";
    emailRef.current.value = "";
    dniRef.current.value = "";
    phoneRef.current.value = "";
  }

  return (
    <section className="my-5   w-[70%] mx-auto border-2 bg-slate-700">
      <div className="flex flex-col gap-4 my-10 w-full px-3  items-center">
        <h1 className="text-3xl my-3 w-fit  font-bold text-violet-400">
          Datos personales
        </h1>
        
        <fieldset>
          <p className="italic w-fit mx-auto ">Nombre (requerido)</p> {/* // ? Dejar modificar name? */}
          <input
            className={`w-full font-bold p-1 disabled:text-blue-950 disabled:opacity-50 ${
              errs?.name && "border-2 border-red-700"
            }`}
            onChange={handleChange}
            type="text"
            name="name"
            value={client?.name && client?.name}
            disabled={!admin && _client?.name ? true : false}
            ref={nameRef}
          />
          {errs?.name && <p className="text-red-500">{errs.name}</p>}
        </fieldset>
        <fieldset className="">
          <p className=" w-fit mx-auto">Email</p>
          <input
            className={`w-full font-bold p-1 ${
              errs?.email && "border-2 border-red-700"
            }`}
            onChange={handleChange}
            type="text"
            name="email"
            value={client?.email && client?.email}
            ref={emailRef}
          />
          {errs?.email && <p className="text-red-500">{errs.email}</p>}
        </fieldset>
        <fieldset className="">
          <p className=" w-fit mx-auto">DNI de la persona que pago </p>
          <input
            className={`w-full font-bold p-1 ${
              errs?.dni && "border-2 border-red-700"
            }`}
            onChange={handleChange}
            type="number"
            name="dni"
            id=""
            value={client?.dni && client?.dni}
            ref={dniRef}
          />
          {errs?.dni && <p className="text-red-500">{errs.dni}</p>}
        </fieldset>
        <fieldset>
          <p className=" w-fit mx-auto">Celular </p>
          <input
            className={`w-full font-bold p-1 ${
              errs?.phone && "border-2 border-red-700"
            }`}
            onChange={handleChange}
            type="number"
            placeholder="011 22222"
            name="phone"
            id="phone"
            value={client?.phone && client?.phone}
            ref={phoneRef}
          />
          {errs?.phone && <p className="text-red-500">{errs.phone}</p>}
        </fieldset>
      </div>
    </section>
  );
}
