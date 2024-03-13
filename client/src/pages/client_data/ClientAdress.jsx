// * UNUSED COMPONENT 
export function ClientAdress({ setAdress }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdress((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <section className="w-full my-5 ">
      <h1 className="my-3 text-lg w-fit mx-auto font-bold text-blue-700">
        Dirección de envio
      </h1>
      <div className="flex flex-col gap-3 px-3">
        <fieldset>
          <p>Codigo postal: </p>
          <input
            onChange={handleChange}
            className=""
            type="number"
            placeholder="011 256356"
            name="postal_code"
            id=""
          />
        </fieldset>
        <fieldset>
          <p>Provincia: </p>
          <input
            onChange={handleChange}
            className=""
            type="text"
            name="province"
            id=""
          />{" "}
          {/* Auto select */}
        </fieldset>
        <fieldset>
          <p>Localidad: </p>
          <input
            onChange={handleChange}
            className=""
            type="text"
            name="city"
            id=""
          />
        </fieldset>
        <fieldset>
          <p>Dirección del domicilio: </p>
          <input
            onChange={handleChange}
            className=""
            type="text"
            placeholder="e.g Av.Sanmartin 57"
            name="adress"
            id=""
          />
        </fieldset>
        <fieldset>
          <p>Piso (opcional) : </p>
          <input
            onChange={handleChange}
            className=""
            type="text"
            placeholder="opcional"
            name="floor"
            id=""
          />
        </fieldset>
        <fieldset>
          <p>Departamento (opcional) : </p>
          <input
            onChange={handleChange}
            className=""
            type="text"
            placeholder="opcional"
            name="deparment"
            id=""
          />
        </fieldset>
      </div>
    </section>
  );
}
