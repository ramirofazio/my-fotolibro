import { Outlet, useLoaderData } from "react-router-dom";
import { Nav } from "../components/";
import { UrlInUse } from "../components/UrlInUse";

export function Root() {
  const client = useLoaderData();
  console.log(client);

  return (
    <div className="bg-main min-h-screen">
      {client?.online ? (
        <UrlInUse/>
      ) : (
        <>
          <Nav />
          <Outlet />
        </>
      )}
    </div>
  );
}
