export function PersonalData({ setUser }) {
  return (
    <section className="my-5  w-full">
      <h1 className="my-3 text-lg w-fit mx-auto font-bold text-blue-700">
        Datos personales
      </h1>
      <div className="flex flex-col gap-3 w-full px-3">
        <fieldset className="">
          <p>DNI de facturación: </p>
          <input className="" type="number" name="dni" id="" />
        </fieldset>
        <fieldset>
          <p>Nombre completo: </p>
          <input className="" type="text" name="name" id="" />
        </fieldset>
        <fieldset>
          <p>Celular: </p>
          <input className="" type="number" placeholder="011 256356" name="phone" id="" />
        </fieldset>
        <fieldset>
          <p>Email: </p>
          <input className="" type="email" name="email" id="" />
        </fieldset>
      </div>
    </section>
  );
}
