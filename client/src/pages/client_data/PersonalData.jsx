export function PersonalData({ _client, admin = false, setClient }) {
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
  };

  return (
    <section className="my-5   w-[70%] mx-auto border-2 bg-slate-700">
      <div className="flex flex-col gap-4 my-10 w-full px-3  items-center">
        <h1 className="text-2xl my-3 w-fit  font-bold text-blue-700">
          Datos personales
        </h1>

        <fieldset className="">
          <p className="italic w-fit mx-auto">Email (requerido)</p>
          <input
            className=" w-full font-bold p-1 disabled:text-blue-950 disabled:opacity-50"
            onChange={handleChange}
            type="email"
            name="email"
            value={_client?.email && _client?.email}
            disabled={(admin && _client?.email) ? true : false}
          />
        </fieldset>

        <fieldset>
          <p className="italic w-fit mx-auto ">Nombre (requerido)</p>
          <input
            className=" w-full font-bold p-1 disabled:text-blue-950 disabled:opacity-50"
            onChange={handleChange}
            type="text"
            name="name"
            value={_client?.name && _client?.name}
            disabled={(admin && _client?.name) ? true : false}
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
            value={_client?.dni && _client?.dni}
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
            value={_client?.phone && _client?.phone}
          />
        </fieldset>
      </div>
    </section>
  );
}
