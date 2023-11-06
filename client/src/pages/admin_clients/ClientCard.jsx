export function ClientCard({ name, email, phone, id, dni }) {
  return (
    <div className="border-2 w-[70%]">
      <section>
        <h1 className="text-xl text-blue-500 capitalize w-fit">{name}</h1>
        <h1 className="text-xl text-blue-500 border-y-2 border-dashed border-red-400">{id}</h1>
      </section>
      <section>
        <h2 className="w-fit mx-auto italic my-2">Info personal</h2>
        <p>Email: {email}</p>
        <p>Numero: {phone}</p>
        <p>DNI: {dni}</p>
        {/* <p>{`email: ${email}, phone: ${phone}, dni: ${dni}`}</p> */}
      </section>
    </div>
  );
}
