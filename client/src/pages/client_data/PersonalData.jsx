export function PersonalData({ setClient }) {
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setClient((prev) => {
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
    /* setErrs(
      isValidSignUp({
        ...user,
        [name]: value,
      })
    ); */
  };

  return (
    <section className="my-5   w-[70%] mx-auto border-2">
      <div className="flex flex-col gap-4 my-10 w-full px-3  items-center">
        <h1 className="text-2xl my-3 w-fit  font-bold text-blue-700">
          Datos personales
        </h1>

        <fieldset className="">
          <p className="italic w-fit mx-auto">Email (requerido)</p>
          <input
            className=" w-full font-bold p-1"
            onChange={handleChange}
            type="email"
            name="email"
            id=""
          />
        </fieldset>

        <fieldset>
          <p className="italic w-fit mx-auto ">Nombre (requerido)</p>
          <input
            className=" w-full font-bold p-1"
            onChange={handleChange}
            type="text"
            name="name"
            id=""
          />
        </fieldset>

        <fieldset className="">
          <p className=" w-fit mx-auto">DNI de facturación </p>
          <input
            className=" w-full font-bold p-1"
            onChange={handleChange}
            type="number"
            name="dni"
            id=""
          />
        </fieldset>

        <fieldset>
          <p className=" w-fit mx-auto">Celular </p>
          <input
            className=" w-full font-bold p-1"
            onChange={handleChange}
            type="number"
            placeholder="011 256356"
            name="phone"
            id=""
          />
        </fieldset>
      </div>
    </section>
  );
}
