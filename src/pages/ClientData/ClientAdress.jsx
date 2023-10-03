
export function ClientAdress() {
  return (
    <section>
      <h1>Dirección de envio</h1>
      <hr />
      <fieldset>
        <p>Codigo postal: </p>
        <input type="number" placeholder="011 256356" name="postal_code" id="" />
      </fieldset>
      <fieldset>
        <p>Provincia: </p>
        <input type="text" name="province" id="" /> {/* Auto select */}
      </fieldset>
      <fieldset>
        <p>Localidad: </p>
        <input type="text" name="city" id="" />
      </fieldset>
      <fieldset>
        <p>Dirección del domicilio: </p>
        <input type="text" placeholder="e.g Av.Sanmartin 57" name="adress" id="" />
      </fieldset>
      <fieldset>
        <p>Piso: </p>
        <input type="text" placeholder="opcional" name="floor" id="" />
      </fieldset>
      <fieldset>
        <p>Departamento: </p>
        <input type="text" placeholder="opcional" name="deparment" id="" />
      </fieldset>
    </section>
  )
}