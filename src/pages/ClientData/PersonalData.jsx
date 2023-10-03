

export function PersonalData({setUser}) {
  return (
    <section>
      <h1>Datos personales</h1>
      <hr />
      <fieldset>
        <p>DNI de facturación: </p>
        <input type="number" name="dni" id="" />
      </fieldset>
      <fieldset>
        <p>Nombre completo: </p>
        <input type="text" name="name" id="" />
      </fieldset>
      <fieldset>
        <p>Celular: </p>
        <input type="number" placeholder="011 256356" name="phone" id="" />
      </fieldset>
      <fieldset>
        <p>Email: </p>
        <input type="email" name="email" id="" />
      </fieldset>
    </section>
  );
}
