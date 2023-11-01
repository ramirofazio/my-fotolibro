export function PersonalData({ setClient }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => {
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
    <section className="my-5   w-[70%] mx-auto">
      <div className="flex flex-col gap-4 my-10 w-full px-3  items-center">
        <h1 className="my-3 text-lg w-fit  font-bold text-blue-700">
          Datos personales
        </h1>

        <fieldset className="">
          <p className=" w-fit mx-auto">Email </p>
          <input
            className=" w-full "
            onChange={handleChange}
            type="email"
            name="email"
            id=""
          />
        </fieldset>

        <fieldset>
          <p className=" w-fit mx-auto">Nombre </p>
          <input
            className=" w-full "
            onChange={handleChange}
            type="text"
            name="name"
            id=""
          />
        </fieldset>

        <fieldset className="">
          <p className=" w-fit mx-auto">DNI de facturación </p>
          <input
            className=" w-full "
            onChange={handleChange}
            type="number"
            name="dni"
            id=""
          />
        </fieldset>

        <fieldset>
          <p className=" w-fit mx-auto">Celular </p>
          <input
            className=" w-full "
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
