import { BookCard } from "./BookCard";

export function Books({ books }) {
  return (
    <div>
      <h1>Books actuales</h1>
      {books?.length ? (
        books.map((b, i) => {
          return <BookCard name={b.name} id={b.id} key={i} />;
        })
      ) : (
        <div>
          <h1>No se encontraron books</h1>
        </div>
      )}
    </div>
  );
}
