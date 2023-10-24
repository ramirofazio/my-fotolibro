export function PersonalData({ setClient }) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    })
    /* setErrs(
      isValidSignUp({
        ...user,
        [name]: value,
      })
    ); */
  };

  return (
    <section className="my-5  w-full">
      <h1 className="my-3 text-lg w-fit mx-auto font-bold text-blue-700">
        Datos personales
      </h1>
      <div className="flex flex-col gap-3 w-full px-3">
        <fieldset className="">
          <p>DNI de facturación: </p>
          <input onChange={handleChange} className="" type="number" name="dni" id="" />
        </fieldset>
        <fieldset>
          <p>Nombre completo: </p>
          <input onChange={handleChange} className="" type="text" name="name" id="" />
        </fieldset>
        <fieldset>
          <p>Celular: </p>
          <input onChange={handleChange} className="" type="number" placeholder="011 256356" name="phone" id="" />
        </fieldset>
        <fieldset>
          <p>Email: </p>
          <input onChange={handleChange} type="email" name="email" id="" />
        </fieldset>
      </div>
    </section>
  );
}
